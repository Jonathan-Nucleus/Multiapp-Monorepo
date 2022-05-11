import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
} from "../lib/apollo-helper";

import { Post, PostRoleFilterOptions } from "../schemas/post";
import {
  PostSchema,
  AudienceOptions,
  AudienceEnum,
  PostCategoryOptions,
  PostCategoryEnum,
  PostRoleFilterEnum,
} from "../schemas/post";

type GraphQLPost = Post.GraphQL;
type PostInput = Omit<Post.Input, "audience" | "categories"> & {
  audience: AudienceEnum;
  categories: PostCategoryEnum[];
};
type PostUpdate = Omit<Post.Update, "audience" | "categories"> & {
  audience: AudienceEnum;
  categories: PostCategoryEnum[];
};

export type {
  GraphQLPost as Post,
  PostInput,
  PostUpdate,
  PostCategoryEnum as PostCategory,
  AudienceEnum as Audience,
  PostRoleFilterEnum as PostRoleFilter,
};

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
  PostRoleFilter: Object.keys(PostRoleFilterOptions).reduce<{
    [key: string]: string;
  }>((acc, option) => {
    acc[option] = PostRoleFilterOptions[option].value;
    return acc;
  }, {}),
  Post: {
    createdAt: async (
      parent: Post.Mongo,
      argsIgnored: NoArgs,
      contextIgnored: ApolloServerContext
    ) => parent._id.getTimestamp(),

    user: async (
      parent: Post.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => (parent.isCompany ? null : db.users.find({ _id: parent.userId })),

    company: async (
      parent: Post.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => (parent.isCompany ? db.companies.find(parent.userId) : null),

    mentions: async (
      parent: Post.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => (parent.mentionIds ? db.users.findAll(parent.mentionIds) : []),

    likes: async (
      parent: Post.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => (parent.likeIds ? db.users.findAll(parent.likeIds) : []),

    comments: async (
      parent: Post.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => (parent.commentIds ? db.comments.findAll(parent.commentIds) : []),

    reporters: async (
      parent: Post.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => (parent.reporterIds ? db.users.findAll(parent.reporterIds) : []),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
