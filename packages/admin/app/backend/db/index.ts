/**
 * A Singleton implementation of the Ignite database object that can be used to
 * execute queries and mutations. This implementation uitlizes a MongoDB
 * data source.
 *
 * The IgniteDb type describes a javascript object whose properties reflect
 * specific collections relevant to the application. Refer to the IgniteDb type
 * for an enumeration of available collections.
 */

import { MongoClient, Db } from "mongodb";

import users from "./collections/users";
import companies from "./collections/companies";
import funds from "./collections/funds";
import posts from "./collections/posts";
import comments from "./collections/comments";
import notifications from "./collections/notifications";
import helpRequests from "./collections/help-requests";

import "dotenv/config";

export type IgniteDb = {
  db: Db;
  client: MongoClient;
  users: ReturnType<typeof users>;
  companies: ReturnType<typeof companies>;
  funds: ReturnType<typeof funds>;
  posts: ReturnType<typeof posts>;
  comments: ReturnType<typeof comments>;
  notifications: ReturnType<typeof notifications>;
  helpRequests: ReturnType<typeof helpRequests>;
};

let connectionPromise: Promise<IgniteDb> | null;
let instance: IgniteDb | null;

/**
 * Initiates a connection to the MongoDB database and returns an instance of
 * the database as a Promise.
 *
 * @param connectionUrl   Optional connection URL for the DB. This is only
 *                        used for things like seeding a specific database.
 *
 * @returns The MongoDB database instance
 */
function connect(
  connectionUrl?: string
): Promise<{ db: Db; client: MongoClient }> {
  const mongoUrl = connectionUrl ?? process.env.MONGO_URI;

  return new Promise<{ db: Db; client: MongoClient }>(
    (resolve, reject): void => {
      if (!mongoUrl) {
        console.error("No mongo URI provided.");
        return reject(new Error("No database provided"));
      }

      MongoClient.connect(mongoUrl, (err, client) => {
        if (err) {
          console.error("Error occurred during connect mongo db", err);
          return reject(err);
        }
        if (!client) {
          console.error("Unable to connect to database.");
          return reject(new Error("Unable to connect to database."));
        }

        const path = mongoUrl.split("/").pop();
        const dbName = path?.split("?").shift();

        if (dbName) {
          const db = client.db(dbName);
          return resolve({ db, client });
        }

        console.error("No database provided.");
        return reject(new Error("No database provided"));
      });
    }
  );
}

/**
 * Create a an instance of IgniteDb, which provides specific typing relevant
 * to mongo collections used within the Prometheus application. A connection and
 * MongoDB database instance is initiated and fetched using `connect()`, and used
 * to construct collection objects on a IgniteDb object instance.
 */
async function createInstance(connectionUrl?: string): Promise<IgniteDb> {
  const { db, client } = await connect(connectionUrl);

  instance = {
    db,
    client,
    users: users(db.collection("users")),
    companies: companies(db.collection("companies")),
    funds: funds(db.collection("funds")),
    posts: posts(
      db.collection("posts"),
      db.collection("users"),
      db.collection("companies")
    ),
    comments: comments(db.collection("comments"), db.collection("posts")),
    notifications: notifications(
      db.collection("notifications"),
      db.collection("users")
    ),
    helpRequests: helpRequests(db.collection("help-requests")),
  } as IgniteDb;
  return instance;
}

/**
 * Provides a a Singleton instance of IgniteDb that can be used to perform
 * queries and mutations on the Ignite database using its collection objects.
 * Note that this returns a promise to the instance. If an instance is already
 * available, it is returned using `Promise.resolve()`. If a connection attempt
 * is already pending, the existing promise is returned. Otherwise, a new
 * connection is initiated.
 */
export function getIgniteDb(connectionUrl?: string): Promise<IgniteDb> {
  if (instance) return Promise.resolve(instance);

  if (!connectionPromise) {
    connectionPromise = createInstance(connectionUrl);
  }

  return connectionPromise;
}

export const disconnectDb = async (): Promise<void> => {
  if (instance) {
    await instance.db.dropDatabase();
    await instance.client.close();
  }
  instance = null;
  connectionPromise = null;
};
