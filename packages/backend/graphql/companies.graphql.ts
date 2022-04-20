import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
} from "../lib/apollo-helper";

import type { Company } from "../schemas/company";
import { CompanySchema } from "../schemas/company";
import { contentCreatorResolvers } from "./users.graphql";

type GraphQLCompany = Company.GraphQL;
export type { GraphQLCompany as Company };

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
    ) => (parent.memberIds ? db.users.findAll(parent.memberIds) : []),

    funds: async (
      parent: Company.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => (parent.fundIds ? db.funds.findAll(parent.fundIds) : []),

    fundManagers: async (
      parent: Company.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) =>
      (await db.users.findAll(parent.memberIds)).filter(
        (member) => member.managedFundsIds && member.managedFundsIds.length > 0
      ),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
