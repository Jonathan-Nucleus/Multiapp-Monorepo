import { ObjectId } from "mongodb";

import type { GraphQLEntity } from "../lib/mongo-helper";
import type { User } from "./user";
import type { Post } from "./post";

export namespace Comment {
  export interface Mongo {
    _id: ObjectId;
    body: string;
    userId: ObjectId;
    postId: ObjectId;
    commentId?: ObjectId;
    likeIds?: ObjectId[];
    likeCount: number;
    mentionIds?: ObjectId[];
    mediaUrl?: string;
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
    "body" | "postId" | "commentId" | "mentionIds" | "mediaUrl"
  >;

  export type Update = Pick<
    GraphQL,
    "_id" | "body" | "mentionIds" | "mediaUrl"
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
    likeCount: Int!
    mentionIds: [ID!]
    mediaUrl: String
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
  }

  input CommentUpdate {
    _id: ID!
    body: String!
    mentionIds: [ID!]
    mediaUrl: String
  }
`;
