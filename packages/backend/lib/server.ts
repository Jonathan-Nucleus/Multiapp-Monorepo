import { ApolloServer } from "apollo-server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import jwt from "jsonwebtoken";

import type { ApolloServerContext } from "./apollo-helper";
import type { DeserializedUser } from "../db/collections/users";
import { isUser } from "../schemas/user";

import { getIgniteDb } from "../db";
import schema from "../graphql";

import "dotenv/config";

const IGNITE_SECRET = process.env.IGNITE_SECRET;
if (!IGNITE_SECRET) throw new Error("IGNITE_SECRET env var undefined");

export const apolloServer = new ApolloServer({
  schema,
  context: async (context): Promise<ApolloServerContext> => {
    const request = context.req;
    const db = await getIgniteDb();

    const token = request.headers?.authorization?.split(" ")?.[1].trim() || "";
    if (token) {
      try {
        // Verify the token
        jwt.verify(token, IGNITE_SECRET);

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
