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

import "dotenv/config";

export type IgniteDb = {
  db: Db;
  users: ReturnType<typeof users>;
  companies: ReturnType<typeof companies>;
  funds: ReturnType<typeof funds>;
  posts: ReturnType<typeof posts>;
  comments: ReturnType<typeof comments>;
};

let connectionPromise: Promise<IgniteDb>;
let instance: IgniteDb;

/**
 * Initiates a connection to the MongoDB database and returns an instance of
 * the database as a Promise.
 *
 * @param connectionUrl   Optional connection URL for the DB. This is only
 *                        used for things like seeding a specific database.
 *
 * @returns The MongoDB database instance
 */
function connect(connectionUrl?: string): Promise<Db> {
  const mongoUrl = connectionUrl ?? process.env.MONGO_URI;

  return new Promise<Db>((resolve, reject): void => {
    if (!mongoUrl) {
      return reject(new Error("No database provided"));
    }

    MongoClient.connect(mongoUrl, (err, client) => {
      if (err) return reject(err);
      if (!client) return reject(new Error("Unable to connect to database."));

      const path = mongoUrl.split("/").pop();
      const dbName = path?.split("?").shift();

      if (dbName) {
        const db = client.db(dbName);
        return resolve(db);
      }

      return reject(new Error("No database provided"));
    });
  });
}

/**
 * Create a an instance of IgniteDb, which provides specific typing relevant
 * to mongo collections used within the Prometheus application. A connection and
 * MongoDB database instance is initiated and fetched using `connect()`, and used
 * to construct collection objects on a IgniteDb object instance.
 */
async function createInstance(): Promise<IgniteDb> {
  const db = await connect();

  instance = {
    db,
    users: users(db.collection("users")),
    companies: companies(db.collection("companies")),
    funds: funds(db.collection("funds")),
    posts: posts(db.collection("posts")),
    comments: comments(db.collection("comments")),
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
export function getIgniteDb(): Promise<IgniteDb> {
  if (instance) return Promise.resolve(instance);

  if (!connectionPromise) {
    connectionPromise = createInstance();
  }

  return connectionPromise;
}
