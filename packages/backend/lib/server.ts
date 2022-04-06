import { ApolloServer } from "apollo-server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import jwt from "jsonwebtoken";

import type { ApolloServerContext } from "backend/lib/apollo-helper";
import type { DeserializedUser } from "backend/db/collections/users";

import { getIgniteDb } from "backend/db";
import schema from "backend/graphql";

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

        // Decode user data from payload to pass along in the GraphQL context
        const user: DeserializedUser = jwt.decode(token) as DeserializedUser;
        return { db, user };
      } catch (e) {
        console.log("Invalid token");
      }
    }

    return { db };
  },
});
