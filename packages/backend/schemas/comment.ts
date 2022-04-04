import { ObjectId } from "mongodb";

import type { ValueOf, GraphQLEntity } from "backend/lib/mongo-helper";
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
    mentionIds?: ObjectId[];
    updatedAt?: number;
  }

  export type GraphQL = GraphQLEntity<Mongo> & {
    user: User.GraphQL;
    post: Post.GraphQL;
    comment?: Comment.GraphQL;
    likes: User.GraphQL[];
    mentions: User.GraphQL[];
  };
}

export const CommentSchema = `
  type Comment {
    _id: ID!
    body: String!
    userId: ID!
    postId: ID!
    commentId: ID
    likeIds: [ID!]
    mentionIds: [ID!]
    createdAt: Int!
    updatedAt: Int

    user: User!
    post: Post!
    comment: Comment
    likes: [User!]!
    mentions: [User!]!
  }
`;
