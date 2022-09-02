import { gql } from "apollo-server-express";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
} from "../lib/apollo/apollo-helper";

import type { Comment } from "../schemas/comment";
import { CommentSchema } from "../schemas/comment";

type GraphQLComment = Comment.GraphQL;
type CommentInput = Comment.Input;
export type { GraphQLComment as Comment, CommentInput };

const schema = gql`
  ${CommentSchema}
`;

const resolvers = {
  Comment: {
    createdAt: async (
      parent: Comment.Mongo,
      argsIgnored: NoArgs,
      contextIgnored: ApolloServerContext
    ) => parent._id.getTimestamp(),

    user: async (
      parent: Comment.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.users.find({ _id: parent.userId }),

    post: async (
      parent: Comment.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.posts.find(parent.postId),

    comment: async (
      parent: Comment.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => {
      if (!parent.commentId) return null;
      return db.comments.find(parent.commentId);
    },

    likes: async (
      parent: Comment.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => (parent.likeIds ? db.users.findAll(parent.likeIds) : []),

    mentions: async (
      parent: Comment.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => (parent.mentionIds ? db.users.findAll(parent.mentionIds) : []),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
