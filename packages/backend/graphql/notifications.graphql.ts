import { gql } from "apollo-server-express";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
} from "../lib/apollo/apollo-helper";

import { Notification, NotificationTypeOptions } from "../schemas/notification";
import { NotificationSchema } from "../schemas/notification";

type GraphQLNotification = Notification.GraphQL;
export type { GraphQLNotification as Notification };

const schema = gql`
  ${NotificationSchema}
`;

const resolvers = {
  NotificationType: Object.keys(NotificationTypeOptions).reduce<{
    [key: string]: string;
  }>((acc, option) => {
    acc[option] = NotificationTypeOptions[option].value;
    return acc;
  }, {}),
  NotificationData: {
    user: async (
      parent: Notification.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.users.find({ _id: parent.userId }),
  },
  Notification: {
    createdAt: async (
      parent: Notification.Mongo,
      argsIgnored: NoArgs,
      contextIgnored: ApolloServerContext
    ) => parent._id.getTimestamp(),

    user: async (
      parent: Notification.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.users.find({ _id: parent.userId }),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
