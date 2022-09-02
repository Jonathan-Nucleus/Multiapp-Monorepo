import { ObjectId } from "mongodb";

import type { GraphQLEntity } from "../lib/mongo-helper";
import type { User } from "./user";
import type { Post } from "./post";
import { Media } from "./post";

export namespace Comment {
  export interface Mongo {
    _id: ObjectId;
    body: string;
    userId: ObjectId;
    postId: ObjectId;
    commentId?: ObjectId;
    likeIds?: ObjectId[];
    likeCount: number;
    // @deprecated and use `attachments` instead
    mediaUrl?: string;
    mentionIds?: ObjectId[];
    attachments?: Media[];
    updatedAt?: Date;
    deleted?: boolean;
  }

  export type GraphQL = Omit<GraphQLEntity<Mongo>, "deleted"> & {
    user: User.GraphQL;
    post: Post.GraphQL;
    comment?: Comment.GraphQL;
    likes: User.GraphQL[];
    mentions: User.GraphQL[];
    createdAt: Date;
  };

  export type Input = Pick<
    GraphQL,
    "body" | "postId" | "commentId" | "mentionIds" | "attachments" | "mediaUrl"
  >;

  export type Update = Pick<
    GraphQL,
    "_id" | "body" | "mentionIds" | "attachments" | "mediaUrl"
  >;
}

export const CommentSchema = `
  type Comment {
    _id: ID!
    body: String!
    userId: ID!
    postId: ID!
    commentId: ID
    likeIds: [ID!]
    mediaUrl: String
    likeCount: Int!
    mentionIds: [ID!]
    attachments: [Media]
    createdAt: Date!
    updatedAt: Date

    user: User!
    post: Post!
    comment: Comment
    likes: [User!]!
    mentions: [User!]!
  }

  input CommentInput {
    body: String!
    postId: ID!
    commentId: ID
    mentionIds: [ID!]
    mediaUrl: String
    attachments: [MediaInput]
  }

  input CommentUpdate {
    _id: ID!
    body: String!
    mentionIds: [ID!]
    mediaUrl: String
    attachments: [MediaInput]
  }
`;
