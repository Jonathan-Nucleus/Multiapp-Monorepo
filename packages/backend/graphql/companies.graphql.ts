import { gql } from "apollo-server";
import { PartialSchema, secureEndpoint } from "../lib/apollo-helper";

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

    createdAt: secureEndpoint(
      async (parent: Company.Mongo, argsIgnored, contextIgnored) =>
        parent._id.getTimestamp()
    ),

    members: secureEndpoint(
      async (parent: Company.Mongo, argsIgnored, { db }) =>
        parent.memberIds ? db.users.findAll(parent.memberIds) : []
    ),

    funds: secureEndpoint(
      async (parent: Company.Mongo, argsIgnored, { db, user }) =>
        parent.fundIds
          ? db.funds.findByAccreditation(user.accreditation, parent.fundIds)
          : []
    ),

    fundManagers: secureEndpoint(
      async (parent: Company.Mongo, argsIgnored, { db }) =>
        (await db.users.findAll(parent.memberIds)).filter(
          (member) =>
            member.managedFundsIds && member.managedFundsIds.length > 0
        )
    ),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
