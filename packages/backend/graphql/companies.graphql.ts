import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
} from "../lib/apollo-helper";

import type { Company } from "../schemas/company";
import { CompanySchema } from "../schemas/company";
import { contentCreatorResolvers } from "./users.graphql";

const schema = gql`
  ${CompanySchema}
`;

const resolvers = {
  Company: {
    ...contentCreatorResolvers,

    createdAt: async (
      parent: Company.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => parent._id.getTimestamp(),

    members: async (
      parent: Company.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.users.findAll(parent.memberIds),

    funds: async (
      parent: Company.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.funds.findAll(parent.fundIds),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
