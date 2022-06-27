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
  InvestorClassOptions,
  FinancialStatusOptions,
  ProRoleOptions,
  Questionnaire,
  QuestionnaireInput,
  FinancialStatusEnum,
  InvestorClassEnum,
  NotificationMethodOptions,
  NotificationEvent,
  User,
  ReportedPost,
  isUser,
  NotificationMethodEnum,
  AccreditationEnum,
} from "../schemas/user";
import type { Company } from "../schemas/company";
import type { PostCategory } from "../schemas/post";

type GraphQLUser = User.GraphQL;
type GraphQLProfile = User.Profile;
type Stub = Omit<User.Stub, "emailToken" | "role">;
type FundManager = User.FundManager;
type OAuthInput = User.OAuthInput;

type SettingsInput = {
  interests?: string[];
  tagging: boolean;
  messaging: boolean;
  emailUnreadMessage: boolean;
  notifications: Record<NotificationEvent, NotificationMethodEnum>;
};

export type {
  GraphQLUser as User,
  GraphQLProfile as UserProfile,
  Stub,
  FundManager,
  OAuthInput,
  Questionnaire,
  QuestionnaireInput,
  SettingsInput,
  AccreditationEnum as Accreditation,
  FinancialStatusEnum as FinancialStatus,
  InvestorClassEnum as InvestorClass,
  NotificationMethodEnum as NotificationMethod,
  NotificationEvent,
};

const schema = gql`
  ${UserSchema}
`;

export const contentCreatorResolvers = {
  posts: secureEndpoint(
    async (
      parent: User.Mongo | Company.Mongo,
      {
        featured,
        categories,
        before,
        limit,
      }: {
        featured?: boolean;
        categories?: PostCategory[];
        before?: string;
        limit?: number;
      },
      { db, user }
    ) =>
      parent.postIds
        ? db.posts.findByFilters(
            user._id,
            user.accreditation,
            {
              postIds: parent.postIds,
              ignorePosts: user.hiddenPostIds,
              categories,
              featured,
            },
            before,
            limit
          )
        : []
  ),

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

  createdAt: async (
    parent: User.Mongo,
    argsIgnored: NoArgs,
    contextIgnored: ApolloServerContext
  ) => parent._id.getTimestamp(),
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

  managedFunds: async (
    parent: User.Mongo,
    argsIgnored: NoArgs,
    { db, user }: ApolloServerContext
  ) =>
    user && parent.managedFundsIds
      ? await db.funds.findByAccreditation(
          user.accreditation,
          parent.managedFundsIds
        )
      : [],
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
  InvestorClass: Object.keys(InvestorClassOptions).reduce<{
    [key: string]: string;
  }>((acc, option) => {
    acc[option] = InvestorClassOptions[option].value;
    return acc;
  }, {}),
  NotificationMethod: NotificationMethodOptions,
  FinancialStatus: Object.keys(FinancialStatusOptions).reduce<{
    [key: string]: string;
  }>((acc, option) => {
    acc[option] = FinancialStatusOptions[option].value;
    return acc;
  }, {}),
  ProRole: Object.keys(ProRoleOptions).reduce<{
    [key: string]: string;
  }>((acc, option) => {
    acc[option] = ProRoleOptions[option].value;
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
