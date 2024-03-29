import { ObjectId } from "mongodb";
import { GraphQLEntity, ValueOf } from "../lib/mongo-helper";
import type { User } from "./user";

export namespace Notification {
  export interface Mongo {
    _id: ObjectId;
    type: NotificationType;
    userId: ObjectId;
    title: string;
    body: string;
    isNew: boolean;
    isRead: boolean;
    data: NotificationData;
    updatedAt?: Date;
  }

  export type GraphQL = GraphQLEntity<Omit<Mongo, "type">> & {
    type: NotificationTypeEnum;
    createdAt: Date;
    user: User.GraphQL;
    data: {
      user: User.GraphQL;
    };
  };
}

export const NotificationTypeOptions = {
  FOLLOWED_BY_USER: {
    label: "Followed by user",
    value: "followed-by-user",
  },
  FOLLOWED_BY_COMPANY: {
    label: "Follwed by company",
    value: "followed-by-company",
  },
  LIKE_POST: {
    label: "Like post",
    value: "like-post",
  },
  COMMENT_POST: {
    label: "Comment post",
    value: "comment-post",
  },
  TAGGED_IN_POST: {
    label: "Tagged in post",
    value: "tagged-in-post",
  },
  TAGGED_IN_COMMENT: {
    label: "Tagged in comment",
    value: "tagged-in-comment",
  },
  CREATE_POST: {
    label: "Create a post",
    value: "create-post",
  },
} as const;
export type NotificationType = ValueOf<typeof NotificationTypeOptions>["value"];
export type NotificationTypeEnum = keyof typeof NotificationTypeOptions;

type OptionalDataKey = "postId" | "commentId";
export type NotificationOptionalData = Partial<
  Record<OptionalDataKey, ObjectId | undefined>
>;
export type NotificationData = NotificationOptionalData & {
  userId: ObjectId;
};

export const NotificationSchema = `
  type Notification {
    _id: ID!
    type: NotificationType!
    userId: ID!
    title: String!
    body: String!
    isNew: Boolean!
    isRead: Boolean!
    data: NotificationData!
    createdAt: Date!
    updatedAt: Date

    user: User!
  }

  enum NotificationType {
    ${Object.keys(NotificationTypeOptions).map((key) => key)}
  }

  type NotificationData {
    userId: ID!
    postId: ID
    commentId: ID

    user: UserProfile!
  }
`;

export const generateNotification = (
  type: NotificationType,
  user: User.Mongo
): { title: string; body: string } => {
  const title = "Prometheus";
  let body = "";

  switch (type) {
    case "followed-by-user":
      body = `${user.fullName} is following you.`;
      break;
    case "like-post":
      body = `${user.fullName} liked your post.`;
      break;
    case "comment-post":
      body = `${user.fullName} commented on your post`;
      break;
    case "tagged-in-post":
      body = `${user.fullName} tagged you in a post`;
      break;
    case "tagged-in-comment":
      body = `${user.fullName} tagged you in a comment`;
      break;
    case "create-post":
      body = `${user.fullName} has created a new post`;
      break;
    default:
      break;
  }

  return { title, body };
};
