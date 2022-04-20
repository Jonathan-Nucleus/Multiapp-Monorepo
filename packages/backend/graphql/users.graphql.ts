import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
  secureEndpoint,
} from "../lib/apollo-helper";

import {
  UserSchema,
  UserRoleOptions,
  AccreditationOptions,
  PostViolationOptions,
  PostViolationEnum,
} from "../schemas/user";
import { User, ReportedPost, isUser } from "../schemas/user";
import type { Post } from "../schemas/post";
import type { Comment } from "../schemas/comment";
import type { Company } from "../schemas/company";

type GraphQLUser = User.GraphQL;
export type { GraphQLUser as User };

const schema = gql`
  ${UserSchema}
`;

export const contentCreatorResolvers = {
  posts: async (
    parent: User.Mongo | Company.Mongo,
    { featured = false }: { featured?: boolean },
    { db }: ApolloServerContext
  ) => (parent.postIds ? db.posts.findAll(parent.postIds, featured) : []),

  comments: async (
    parent: User.Mongo | Company.Mongo,
    argsIgnored: NoArgs,
    { db }: ApolloServerContext
  ) => (parent.commentIds ? db.comments.findAll(parent.commentIds) : []),

  followers: async (
    parent: User.Mongo | Company.Mongo,
    argsIgnored: NoArgs,
    { db }: ApolloServerContext
  ) => (parent.followerIds ? db.users.findAll(parent.followerIds) : []),

  following: async (
    parent: User.Mongo | Company.Mongo,
    argsIgnored: NoArgs,
    { db }: ApolloServerContext
  ) => (parent.followingIds ? db.users.findAll(parent.followingIds) : []),

  companyFollowers: async (
    parent: User.Mongo | Company.Mongo,
    argsIgnored: NoArgs,
    { db }: ApolloServerContext
  ) =>
    parent.companyFollowerIds
      ? db.users.findAll(parent.companyFollowerIds)
      : [],

  companyFollowing: async (
    parent: User.Mongo | Company.Mongo,
    argsIgnored: NoArgs,
    { db }: ApolloServerContext
  ) =>
    parent.companyFollowingIds
      ? db.users.findAll(parent.companyFollowingIds)
      : [],
};

export const publicUserResolvers = {
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
  ) => (parent.companyIds ? db.companies.findAll(parent.companyIds) : []),

  watchlist: async (
    parent: User.Mongo,
    argsIgnored: NoArgs,
    { db }: ApolloServerContext
  ) => (parent.watchlistIds ? db.funds.findAll(parent.watchlistIds) : []),
};

const resolvers = {
  UserRole: UserRoleOptions,
  Accreditation: Object.keys(AccreditationOptions).reduce<{
    [key: string]: string;
  }>((acc, option) => {
    acc[option] = AccreditationOptions[option].value;
    return acc;
  }, {}),
  PostViolation: Object.keys(PostViolationOptions).reduce<{
    [key: string]: string;
  }>((acc, option) => {
    acc[option] = PostViolationOptions[option].value;
    return acc;
  }, {}),
  UserProfile: {
    ...contentCreatorResolvers,
    ...publicUserResolvers,
  },
  Invitee: {
    __resolveType(obj: User.Mongo | User.Stub): string {
      return isUser(obj) ? "User" : "UserStub";
    },
  },
  User: {
    ...contentCreatorResolvers,
    ...publicUserResolvers,

    createdAt: async (
      parent: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => parent._id.getTimestamp(),

    managedFunds: async (
      parent: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) =>
      parent.managedFundsIds ? db.funds.findAll(parent.managedFundsIds) : [],

    mutedPosts: async (
      parent: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => (parent.mutedPostIds ? db.posts.findAll(parent.mutedPostIds) : []),

    hiddenPosts: async (
      parent: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => (parent.hiddenPostIds ? db.posts.findAll(parent.hiddenPostIds) : []),

    hiddenUsers: async (
      parent: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => (parent.hiddenUserIds ? db.users.findAll(parent.hiddenUserIds) : []),

    invitees: async (
      parent: User.Mongo,
      argsIgnored: NoArgs,
      { db }: ApolloServerContext
    ) => (parent.inviteeIds ? db.users.findAll(parent.inviteeIds, true) : []),
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
