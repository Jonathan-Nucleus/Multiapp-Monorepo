import { ApolloServer } from "apollo-server-micro";
import jwt from "jsonwebtoken";
import "dotenv/config";

import { ApolloServerContext, formatError } from "./apollo-helper";
import type { DeserializedUser } from "../db/collections/users";
import { isUser, User } from "../schemas/user";

import { getIgniteDb } from "../db";
import schema from "../graphql";
import apolloLogger from "./plugins/apollo-logger";

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const APP_ENV = process.env.APP_ENV;

if (!ADMIN_SECRET) throw new Error("ADMIN_SECRET env var undefined");
if (!APP_ENV) throw new Error("APP_ENV env var undefined");

export const createApolloServer = (mongoUrl?: string): ApolloServer =>
  new ApolloServer({
    schema,
    formatError,
    introspection: APP_ENV === "development",
    plugins: [apolloLogger],
    context: async (context): Promise<ApolloServerContext> => {
      const db = await getIgniteDb(mongoUrl);
      const request = context.req;
      const token =
        request?.headers?.authorization?.split(" ")?.[1].trim() || "";
      if (token) {
        try {
          // Verify the token
          jwt.verify(token, ADMIN_SECRET);

          // Decode user data from payload to check if user exists and pass data
          // on to resolvers
          const user: DeserializedUser = jwt.decode(token) as DeserializedUser;
          const userData = await db.users.find({ _id: user._id });
          if (userData && isUser(userData)) {
            return { db, user: userData };
          }
        } catch (e) {
          console.log("Invalid token", e);
        }
      }

      return { db };
    },
  });

export const createTestApolloServer = (
  user?: User.Mongo | null
): ApolloServer =>
  new ApolloServer({
    schema,
    formatError,
    introspection: true,
    context: async (): Promise<ApolloServerContext> => {
      const db = await getIgniteDb();
      if (!user) {
        return { db };
      }

      const userData = (await db.users.find({
        _id: user._id,
      })) as User.Mongo;

      return { db, user: userData };
    },
  });
