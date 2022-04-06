import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
  secureEndpoint,
} from "backend/lib/apollo-helper";

import type { User } from "backend/schemas/user";

const schema = gql`
  type Query {
    verifyInvite(code: String!): Boolean!
    users: [User!]
  }
`;

const resolvers = {
  Query: {
    verifyInvite: async (
      parentIgnored: unknown,
      { code }: { code: string },
      { db }: ApolloServerContext
    ): Promise<boolean> => db.users.verifyInvite(code),

    users: async (
      parentIgnored: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ): Promise<User.Mongo[]> => db.users.findAll(),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
