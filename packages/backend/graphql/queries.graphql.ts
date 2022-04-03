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
    users: [User!]
  }
`;

const resolvers = {
  Query: {
    users: async (
      parentIgnored: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ): Promise<User.Mongo[]> => db.users.findAll(),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
