import { gql } from "apollo-server-express";
import * as yup from "yup";
import _ from "lodash";
import {
  decodeToken,
  AccessTokenPayload,
  getDocumentToken,
} from "../lib/tokens";
import { getChatToken } from "../lib/get-stream";
import {
  PartialSchema,
  ApolloServerContext,
  secureEndpoint,
} from "../lib/apollo/apollo-helper";
import {
  isObjectId,
  NotFoundError,
  UnprocessableEntityError,
  validateArgs,
} from "../lib/apollo/validate";

import { User, isUser, compareAccreditation } from "../schemas/user";
import type { Company } from "../schemas/company";
import {
  Post,
  PostCategory,
  PostCategoryOptions,
  PostRoleFilter,
  PostRoleFilterOptions,
} from "../schemas/post";
import type { Fund } from "../schemas/fund";
import type { Notification } from "../schemas/notification";

import "dotenv/config";
import { Client } from "peekalink";

// TODO: Update Dockerfile to enable imports from shared library
// import { LINK_PATTERN } from "shared/src/patterns";

const LINK_PATTERN =
  /((?:(?:https|http|ftp):\/\/)?(?:www\.)?(?:[-a-zA-Z\d@:%._+~#=]{2,256}\.[a-z]{2,6}\b)+(?:\/[/\d\w.\-?=&%+#]+)?)/gim;

/** Index at which highlighted posts appear on the first page of the feed. */
const HIGHLIGHTED_POST_INDEX = 3;

const client = new Client({ apiKey: `${process.env.PEEKALINK_API_KEY}` });

const schema = gql`
  type Query {
    version: String
    verifyToken(token: String!): Boolean!
    verifyInvite(code: String!): Boolean!
    requiresUpdate(version: String!, build: String!): Boolean!
    account: User
    chatToken: String
    documentToken(fundId: ID!, document: String!): String
    post(postId: ID!): Post
    posts(
      categories: [PostCategory!]
      roleFilter: PostRoleFilter
      before: ID
      limit: Int
    ): [Post!]
    linkPreview(body: String!): LinkPreview
    funds: [Fund!]
    fund(fundId: ID!): Fund
    fundManagers(featured: Boolean): FundManagers
    fundCompanies: [Company!]
    professionals(featured: Boolean): [UserProfile!]
    userProfile(userId: ID!): UserProfile
    companyProfile(companyId: ID!): Company
    notifications(before: ID, limit: Int): [Notification!]
    mentionUsers(search: String): [UserProfile!]
    globalSearch(search: String): GlobalSearchResult
    users: [UserProfile!]!
  }

  type FundManagers {
    managers: [UserProfile!]!
    funds: [Fund!]!
  }

  type GlobalSearchResult {
    users: [UserProfile!]!
    companies: [Company!]!
    posts: [Post!]!
    funds: [Fund!]!
  }
`;

export type LinkPreview = Exclude<Post.GraphQL["preview"], undefined>;

export type FundManagers = {
  managers: User.Mongo[];
  funds: Fund.Mongo[];
};

export type GlobalSearchResult = {
  users: User.Mongo[];
  companies: Company.Mongo[];
  posts: Post.Mongo[];
  funds: Fund.Mongo[];
};

const resolvers = {
  Query: {
    /**
     * Returns the server version.
     */
    version: secureEndpoint(async (): Promise<string> => {
      return process.env.COMMIT_HASH as string;
    }),

    verifyToken: async (
      parentIgnored: unknown,
      args: { token: string },
      { db }: ApolloServerContext
    ): Promise<boolean> => {
      const validator = yup
        .object()
        .shape({
          token: yup.string().required(),
        })
        .required();

      validateArgs(validator, args);

      const { token } = args;

      try {
        const payload = decodeToken(token) as AccessTokenPayload;
        const user = await db.users.find({ _id: payload._id });
        return !!user;
      } catch {
        return false;
      }
    },

    verifyInvite: async (
      parentIgnored: unknown,
      args: { code: string },
      { db }: ApolloServerContext
    ): Promise<boolean> => {
      const validator = yup
        .object()
        .shape({
          code: yup.string().required(),
        })
        .required();

      validateArgs(validator, args);

      const { code } = args;
      return db.users.verifyInvite(code);
    },

    requiresUpdate: async (
      parentIgnored: unknown,
      args: { version: string; build: string }
    ): Promise<boolean> => {
      const validator = yup
        .object()
        .shape({
          version: yup.string().required(),
          build: yup.string().required(),
        })
        .required();

      validateArgs(validator, args);

      const { build } = args;
      const buildNumber = parseInt(build);
      const minRequiredBuild = parseInt(process.env.MIN_MOBILE_BUILD ?? "");
      if (!Number.isNaN(buildNumber) && !Number.isNaN(minRequiredBuild)) {
        return buildNumber < minRequiredBuild;
      }

      return false;
    },

    /**
     * Fetch account details for the currently authenticated user.
     *
     * @returns   The User object associated with the current user.
     */
    post: secureEndpoint(
      async (
        parentIgnored,
        args: { postId: string },
        { db }
      ): Promise<Post.Mongo | null> => {
        const validator = yup
          .object()
          .shape({
            postId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid post id",
            }),
          })
          .required();

        validateArgs(validator, args);

        const { postId } = args;

        const postData = await db.posts.find(postId);
        if (!postData) {
          throw new NotFoundError("Post");
        }

        return postData;
      }
    ),

    posts: secureEndpoint(
      async (
        parentIgnored,
        args: {
          categories?: PostCategory[];
          roleFilter?: PostRoleFilter;
          before?: string;
          limit?: number;
        },
        { db, user }
      ): Promise<Post.Mongo[]> => {
        const validator = yup
          .object()
          .shape({
            categories: yup.array().of(
              yup
                .string()
                .oneOf(_.map(Object.values(PostCategoryOptions), "value"))
                .required()
            ),
            roleFilter: yup
              .string()
              .oneOf(_.map(Object.values(PostRoleFilterOptions), "value")),
            before: yup.string().notRequired().test({
              test: isObjectId,
              message: "Invalid post id",
            }),
            limit: yup.number().integer().min(0).notRequired(),
          })
          .required();

        validateArgs(validator, args);

        const { categories, roleFilter = "everyone", before, limit } = args;

        const userData = await db.users.find({ _id: user._id });
        if (!userData || !isUser(userData)) {
          throw new NotFoundError();
        }

        // Include all channels and companies that have funds
        const fundCompanies = await db.companies.fundCompanies();
        const channels = await db.companies.channels();
        const includeCompanies = Array.from(
          new Set([
            ...channels.map((channel) => channel._id.toString()),
            ...fundCompanies.map((company) => company._id.toString()),
          ])
        );

        const posts = await db.posts.findByFilters(
          user._id,
          user.accreditation,
          {
            categories,
            roleFilter,
            ignorePosts: userData.hiddenPostIds,
            ignoreUsers: userData.hiddenUserIds,
            includeUsers: includeCompanies,
            followingUsers: [
              ...(userData.followingIds || []),
              ...(userData.companyFollowingIds || []),
            ],
          },
          before,
          limit
        );

        // Insert any highlighted posts if this is the first page of posts
        // being fetched
        if (!before) {
          const highlighted = await db.posts.findHighlighted();
          if (highlighted.length > 0) {
            const highlightedPostIndex = Math.floor(
              Math.random() * highlighted.length
            );

            posts.splice(
              HIGHLIGHTED_POST_INDEX,
              0,
              highlighted[highlightedPostIndex]
            );
          }
        }

        return posts;
      }
    ),

    /**
     * Fetch a link preview for links in any text body.
     *
     * @returns   The link preview data or null if none could be generated.
     */
    linkPreview: secureEndpoint(
      async (
        parentIgnored,
        { body }: { body: string }
      ): Promise<LinkPreview | null> => {
        try {
          const link = body.match(LINK_PATTERN)?.[0];

          if (link) {
            const preview = await client.preview(link);

            return {
              url: preview.url,
              mediaType: preview.mimeType,
              contentType: `${preview.contentType}`,
              favicons: preview?.icon?.url ? [preview.icon.url] : [],
              title: preview.title,
              siteName: preview.domain,
              description: preview.description,
              images: preview?.image?.url ? [preview.image.url] : [],
            };
          } else {
            return null;
          }
        } catch (error) {
          console.log(
            "Error generating linking preview for",
            body,
            JSON.stringify(error, null, 2)
          );
        }

        return null;
      }
    ),

    /**
     * Fetch account details for the currently authenticated user.
     *
     * @returns   The User object associated with the current user.
     */
    account: secureEndpoint(
      async (
        parentIgnored,
        argsIgnored,
        { user }
      ): Promise<User.Mongo | null> => user
    ),

    chatToken: secureEndpoint(
      async (parentIgnored, argsIgnored, { user }): Promise<string> =>
        getChatToken(user._id.toString())
    ),

    documentToken: secureEndpoint(
      async (
        parentIgnored,
        args: { fundId: string; document: string },
        { db, user }
      ): Promise<string | null> => {
        const validator = yup
          .object()
          .shape({
            fundId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid fund id",
            }),
            document: yup.string().required(),
          })
          .required();

        validateArgs(validator, args);

        const { fundId, document: filename } = args;
        const fund = await db.funds.find(fundId);

        if (!fund) {
          throw new NotFoundError("Fund");
        }

        if (compareAccreditation(user.accreditation, fund.level) < 0) {
          return null;
        }

        if (!fund.documents?.some((doc) => doc.url === filename)) {
          throw new NotFoundError("Document");
        }

        return getDocumentToken(user.email, fundId, filename);
      }
    ),

    funds: secureEndpoint(
      async (
        parentIgnored,
        argsIgnored,
        { db, user }
      ): Promise<Fund.Mongo[]> => {
        return db.funds.findByAccreditation(user.accreditation);
      }
    ),

    fund: secureEndpoint(
      async (
        parentIgnored,
        args: { fundId: string },
        { db, user }
      ): Promise<Fund.Mongo | null> => {
        const validator = yup
          .object()
          .shape({
            fundId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid fund id",
            }),
          })
          .required();

        validateArgs(validator, args);

        const { fundId } = args;

        const fund = await db.funds.find(fundId);
        if (!fund) {
          throw new NotFoundError("Fund");
        }
        if (compareAccreditation(user.accreditation, fund.level) < 0) {
          throw new UnprocessableEntityError("Not able to get a fund.");
        }

        return fund;
      }
    ),

    fundManagers: secureEndpoint(
      async (
        parentIgnored,
        args: { featured?: boolean },
        { db, user }
      ): Promise<FundManagers> => {
        const validator = yup
          .object()
          .shape({
            featured: yup.bool(),
          })
          .required();

        validateArgs(validator, args);

        const { featured = false } = args;

        const managers = await db.users.fundManagers(featured);
        const fundIds = Array.from(
          new Set(managers.map((manager) => manager.managedFundsIds).flat())
        );

        const accessibleFunds = (await db.funds.findAll(fundIds)).filter(
          (fund) => compareAccreditation(user.accreditation, fund.level) >= 0
        );
        const accessibleFundIds = accessibleFunds.map((fund) =>
          fund._id.toString()
        );
        const filteredManagers = managers.map((manager) => ({
          ...manager,
          managedFundsIds: manager.managedFundsIds.filter((id) =>
            accessibleFundIds.includes(id.toString())
          ),
        }));

        return {
          funds: accessibleFunds,
          managers: filteredManagers,
        };
      }
    ),

    fundCompanies: secureEndpoint(
      async (parentIgnored, argsIgnored, { db }): Promise<Company.Mongo[]> =>
        db.companies.fundCompanies()
    ),

    professionals: secureEndpoint(
      async (
        parentIgnored,
        args: { featured?: boolean },
        { db }
      ): Promise<User.Mongo[]> => {
        const validator = yup
          .object()
          .shape({
            featured: yup.bool(),
          })
          .required();

        validateArgs(validator, args);

        const { featured = false } = args;

        return db.users.professionals(featured);
      }
    ),

    userProfile: secureEndpoint(
      async (
        parentIgnored,
        args: { userId: string },
        { db }
      ): Promise<User.Mongo | User.Stub> => {
        const validator = yup
          .object()
          .shape({
            userId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid user id",
            }),
          })
          .required();

        validateArgs(validator, args);

        const { userId } = args;

        const userData = await db.users.find({ _id: userId });

        if (!userData) {
          throw new NotFoundError();
        }

        return userData;
      }
    ),

    companyProfile: secureEndpoint(
      async (
        parentIgnored,
        args: { companyId: string },
        { db }
      ): Promise<Company.Mongo> => {
        const validator = yup
          .object()
          .shape({
            companyId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid company id",
            }),
          })
          .required();

        validateArgs(validator, args);

        const { companyId } = args;

        const companyData = await db.companies.find(companyId);
        if (!companyData) {
          throw new NotFoundError("Company");
        }

        return companyData;
      }
    ),

    notifications: secureEndpoint(
      async (
        parentIgnored,
        args: {
          before?: string;
          limit?: number;
        },
        { db, user }
      ): Promise<Notification.Mongo[]> => {
        const validator = yup
          .object()
          .shape({
            before: yup
              .string()
              .notRequired()
              .test({
                test: isObjectId,
                message: "Invalid post id",
              })
              .notRequired(),
            limit: yup.number().integer().min(0).notRequired(),
          })
          .required();

        validateArgs(validator, args);
        return db.notifications.findByFilters(
          user._id,
          args.before,
          args.limit
        );
      }
    ),

    mentionUsers: secureEndpoint(
      async (
        parentIgnored,
        args: { search?: string },
        { db }
      ): Promise<User.Mongo[]> => {
        const validator = yup
          .object()
          .shape({
            search: yup.string(),
          })
          .required();

        validateArgs(validator, args);

        const { search } = args;

        return db.users.findByKeyword(search);
      }
    ),

    globalSearch: secureEndpoint(
      async (
        parentIgnored,
        args: { search?: string },
        { db, user }
      ): Promise<GlobalSearchResult> => {
        const validator = yup
          .object()
          .shape({
            search: yup.string(),
          })
          .required();

        validateArgs(validator, args);

        const { search } = args;

        const [users, companies, posts, funds] = await Promise.all([
          db.users.findByKeyword(search),
          db.companies.findByKeyword(search),
          db.posts.findByKeyword(
            user.accreditation === "none" ? "everyone" : user.accreditation,
            search
          ),
          db.funds.findByKeyword(user.accreditation, search),
        ]);

        return { users, companies, posts, funds };
      }
    ),

    users: secureEndpoint(
      async (parentIgnored, argsIgnored, { db }): Promise<User.Mongo[]> =>
        db.users.findAll()
    ),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
