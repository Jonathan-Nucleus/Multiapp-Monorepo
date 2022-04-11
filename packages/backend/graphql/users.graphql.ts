import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
  secureEndpoint,
} from "backend/lib/apollo-helper";

import {
  UserSchema,
  UserRoleOptions,
  AccreditationOptions,
  PostViolationOptions,
  PostViolationEnum,
} from "backend/schemas/user";
import type { User, ReportedPost } from "backend/schemas/user";
import type { Post } from "backend/schemas/post";
import type { Comment } from "backend/schemas/comment";
import type { Company } from "backend/schemas/company";

const schema = gql`
  ${UserSchema}
`;

export const contentCreatorResolvers = {
  posts: async (
    parent: User.Mongo | Company.Mongo,
    argsIgnored: NoArgs,
    { db }: ApolloServerContext
  ) => db.posts.findAll(parent.postIds),

  comments: async (
    parent: User.Mongo | Company.Mongo,
    argsIgnored: NoArgs,
    { db }: ApolloServerContext
  ) => db.comments.findAll(parent.commentIds),

  followers: async (
    parent: User.Mongo | Company.Mongo,
    argsIgnored: NoArgs,
    { db }: ApolloServerContext
  ) => db.users.findAll(parent.followerIds),

  following: async (
    parent: User.Mongo | Company.Mongo,
    argsIgnored: NoArgs,
    { db }: ApolloServerContext
  ) => db.users.findAll(parent.followingIds),

  companyFollowers: async (
    parent: User.Mongo | Company.Mongo,
    argsIgnored: NoArgs,
    { db }: ApolloServerContext
  ) => db.users.findAll(parent.companyFollowerIds),

  companyFollowing: async (
    parent: User.Mongo | Company.Mongo,
    argsIgnored: NoArgs,
    { db }: ApolloServerContext
  ) => db.users.findAll(parent.companyFollowingIds),
};

const resolvers = {
  UserRole: UserRoleOptions,
  Accreditation: AccreditationOptions,
  PostViolation: Object.keys(PostViolationOptions).reduce<{
    [key: string]: string;
  }>((acc, option) => {
    acc[option] = PostViolationOptions[option].value;
    return acc;
  }, {}),
  User: {
    ...contentCreatorResolvers,

    createdAt: async (
      parent: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => parent._id.getTimestamp(),

    hasPassword: (parent: User.Mongo): boolean => !!parent.password,

    company: async (
      parent: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) =>
      parent.companyIds?.[0] ? db.companies.find(parent.companyIds[0]) : null,

    companies: async (
      parent: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.companies.findAll(parent.companyIds),

    mutedPosts: async (
      parent: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.posts.findAll(parent.mutedPostIds),

    hiddenPosts: async (
      parent: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.posts.findAll(parent.hiddenPostIds),

    hiddenUsers: async (
      parent: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.users.findAll(parent.hiddenUserIds),

    invitees: async (
      parent: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.users.findAll(parent.inviteeIds),
  },

  ReportedPost: {
    post: async (
      parent: ReportedPost,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => db.posts.find(parent.postId),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
