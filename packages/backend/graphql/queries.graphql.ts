import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
  AccessToken,
  secureEndpoint,
  getAccessToken,
} from "backend/lib/apollo-helper";

import type { User } from "backend/schemas/user";

const schema = gql`
  type Query {
    login(email: String!, password: String!): String
    users: [User!]
  }
`;

const resolvers = {
  Query: {
    login: async (
      parentIgnored: User.Mongo,
      { email, password }: { email: string; password: string },
      { db }: ApolloServerContext
    ): Promise<AccessToken | null> => {
      const user = await db.users.authenticate(email, password);
      if (!user) return null;

      const deserializedUser = await db.users.deserialize(user._id);
      return deserializedUser ? getAccessToken(deserializedUser) : null;
    },

    users: async (
      parentIgnored: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ): Promise<User.Mongo[]> => db.users.findAll(),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
