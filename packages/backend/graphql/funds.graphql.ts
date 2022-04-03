import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
  secureEndpoint,
} from "backend/lib/apollo-helper";

import type { Fund } from "backend/schemas/fund";
import {
  FundSchema,
  FundStatusOptions,
  DocumentCategoryOptions,
} from "backend/schemas/fund";

const schema = gql`
  ${FundSchema}
`;

const resolvers = {
  FundStatus: FundStatusOptions,
  DocumentCategory: DocumentCategoryOptions,
  Fund: {
    createdAt: async (
      parent: Fund.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
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
    ) => db.users.findAll(parent.teamIds),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
