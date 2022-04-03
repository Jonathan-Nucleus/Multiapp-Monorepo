import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
} from "backend/lib/apollo-helper";

import type { Comment } from "backend/schemas/comment";
import { CommentSchema } from "backend/schemas/comment";

const schema = gql`
  ${CommentSchema}
`;

const resolvers = {
  Comment: {
    createdAt: async (
      parent: Comment.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => parent._id.getTimestamp(),

    user: async (
      parent: Comment.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.users.find({ _id: parent._id }),

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
    ) => db.users.findAll(parent.likeIds),

    mentions: async (
      parent: Comment.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.users.findAll(parent.mentionIds),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
