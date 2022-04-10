import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
  secureEndpoint,
} from "backend/lib/apollo-helper";

import type { Post } from "backend/schemas/post";
import {
  PostSchema,
  AudienceOptions,
  PostCategoryOptions,
  PostCategoryEnum,
} from "backend/schemas/post";

type GraphQLPost = Post.GraphQL;
export type { PostCategoryEnum as PostCategory, GraphQLPost as Post };

const schema = gql`
  ${PostSchema}
`;

const resolvers = {
  Audience: AudienceOptions,
  PostCategory: Object.keys(PostCategoryOptions).reduce<{
    [key: string]: string;
  }>((acc, option) => {
    acc[option] = PostCategoryOptions[option].value;
    return acc;
  }, {}),
  Post: {
    createdAt: async (
      parent: Post.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => parent._id.getTimestamp(),

    user: async (
      parent: Post.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.users.find({ _id: parent.userId }),

    mentions: async (
      parent: Post.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.users.findAll(parent.mentionIds),

    likes: async (
      parent: Post.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.users.findAll(parent.likeIds),

    comments: async (
      parent: Post.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.comments.findAll(parent.commentIds),

    reporters: async (
      parent: Post.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.users.findAll(parent.reporterIds),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
