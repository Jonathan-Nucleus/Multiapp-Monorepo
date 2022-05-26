import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
} from "../lib/apollo-helper";

import type { Fund } from "../schemas/fund";
import type { AccreditationEnum } from "../schemas/user";
import {
  FundSchema,
  FundStatusOptions,
  DocumentCategoryOptions,
  AssetClassOptions,
} from "../schemas/fund";

type GraphQLFund = Fund.GraphQL;
export type { GraphQLFund as Fund, AccreditationEnum as Accredidation };

const schema = gql`
  ${FundSchema}
`;

const resolvers = {
  FundStatus: FundStatusOptions,
  DocumentCategory: DocumentCategoryOptions,
  AssetClass: Object.keys(AssetClassOptions).reduce<{
    [key: string]: string;
  }>((acc, option) => {
    acc[option] = AssetClassOptions[option].value;
    return acc;
  }, {}),
  Fund: {
    createdAt: async (
      parent: Fund.Mongo,
      argsIgnored: NoArgs,
      contextIgnored: ApolloServerContext
    ) => parent._id.getTimestamp(),

    manager: async (
      parent: Fund.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.users.find({ _id: parent.managerId }),

    company: async (
      parent: Fund.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.companies.find(parent.companyId),

    team: async (
      parent: Fund.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => (parent.teamIds ? db.users.findAll(parent.teamIds) : []),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
