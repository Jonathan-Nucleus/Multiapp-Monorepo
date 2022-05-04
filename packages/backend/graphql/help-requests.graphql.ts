import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
} from "../lib/apollo-helper";

import {
  HelpRequest,
  HelpRequestSchema,
  HelpRequestTypeOptions,
  PreferredTimeOfDayOptions,
} from "../schemas/help-request";

type GraphQLHelpRequest = HelpRequest.GraphQL;
export type { GraphQLHelpRequest as HelpRequest };

export const HelpRequestTypeMapping = Object.keys(
  HelpRequestTypeOptions
).reduce<{
  [key: string]: string;
}>((acc, option) => {
  acc[HelpRequestTypeOptions[option].value] =
    HelpRequestTypeOptions[option].label;
  return acc;
}, {});

export const PreferredTimeOfDayOptionsMapping = Object.keys(
  PreferredTimeOfDayOptions
).reduce<{
  [key: string]: string;
}>((acc, option) => {
  acc[PreferredTimeOfDayOptions[option].value] =
    PreferredTimeOfDayOptions[option].label;
  return acc;
}, {});

const schema = gql`
  ${HelpRequestSchema}
`;

const resolvers = {
  HelpRequestType: Object.keys(HelpRequestTypeOptions).reduce<{
    [key: string]: string;
  }>((acc, option) => {
    acc[option] = HelpRequestTypeOptions[option].value;
    return acc;
  }, {}),
  PreferredTimeOfDay: Object.keys(PreferredTimeOfDayOptions).reduce<{
    [key: string]: string;
  }>((acc, option) => {
    acc[option] = PreferredTimeOfDayOptions[option].value;
    return acc;
  }, {}),
  HelpRequest: {
    createdAt: async (
      parent: HelpRequest.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => parent._id.getTimestamp(),

    user: async (
      parent: HelpRequest.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.users.find({ _id: parent.userId }),

    fund: async (
      parent: HelpRequest.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.funds.find(parent.fundId),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
