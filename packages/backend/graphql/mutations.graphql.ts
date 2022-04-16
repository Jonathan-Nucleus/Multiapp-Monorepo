import { gql } from "apollo-server";
import * as yup from "yup";
import { PrometheusMailer } from "../email";

import {
  PartialSchema,
  ApolloServerContext,
  secureEndpoint,
} from "../lib/apollo-helper";
import {
  getAccessToken,
  getResetToken,
  decodeToken,
  AccessToken,
  ResetTokenPayload,
} from "../lib/tokens";
import { getUploadUrl, RemoteUpload } from "../lib/s3-helper";
import {
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError,
  validateArgs,
} from "../lib/validate";

import {
  User,
  Settings,
  ReportedPost,
  compareAccreditation,
} from "../schemas/user";
import { AudienceOptions } from "../schemas/post";
import type { Post } from "../schemas/post";
import type { Comment } from "../schemas/comment";

const schema = gql`
  type Mutation {
    register(user: UserInput!): String
    login(email: String!, password: String!): String
    loginOAuth(user: OAuthUserInput!): String
    requestPasswordReset(email: String!): Boolean!
    resetPassword(password: String!, token: String!): String
    requestInvite(email: String!): Boolean
    inviteUser(email: String!): Boolean!
    updateSettings(settings: SettingsInput!): Boolean

    createPost(post: PostInput!): Post
    featurePost(postId: ID!, feature: Boolean!): Post
    likePost(like: Boolean!, postId: ID!): Post
    reportPost(report: ReportedPostInput!): Boolean
    hidePost(hide: Boolean!, postId: ID!): Boolean
    mutePost(mute: Boolean!, postId: ID!): Boolean
    comment(comment: CommentInput!): Comment
    editComment(comment: CommentUpdate!): Comment
    deleteComment(commentId: ID!): Boolean!
    uploadLink(localFilename: String!, type: MediaType!): MediaUpload

    watchFund(watch: Boolean!, fundId: ID!): Boolean
    followUser(follow: Boolean!, userId: ID!, asCompanyId: ID): Boolean
    followCompany(follow: Boolean!, companyId: ID!, asCompanyId: ID): Boolean
    hideUser(hide: Boolean!, userId: ID!): Boolean!
  }

  type MediaUpload {
    remoteName: String!
    uploadUrl: String!
  }

  enum MediaType {
    POST
    AVATAR
    BACKGROUND
  }
`;

export type MediaUpload = RemoteUpload;
export type MediaType = "POST" | "AVATAR" | "BACKGROUND";

const resolvers = {
  Mutation: {
    register: async (
      parentIgnored: unknown,
      args: { user: User.Input },
      { db }: ApolloServerContext
    ): Promise<AccessToken> => {
      const validator = yup
        .object()
        .shape({
          user: yup
            .object()
            .shape({
              email: yup.string().email().required(),
              firstName: yup.string().required(),
              lastName: yup.string().required(),
              password: yup.string().required(),
            })
            .required(),
        })
        .required();

      validateArgs(validator, args);

      const { user } = args;

      const userId = await db.users.register(user);

      const deserializedUser = await db.users.deserialize(userId);
      return getAccessToken(deserializedUser);
    },

    login: async (
      parentIgnored: User.Mongo,
      args: { email: string; password: string },
      { db }: ApolloServerContext
    ): Promise<AccessToken> => {
      const validator = yup
        .object()
        .shape({
          email: yup.string().email().required(),
          password: yup.string().required(),
        })
        .required();

      validateArgs(validator, args);

      const { email, password } = args;

      const user = await db.users.authenticate(email, password);

      const deserializedUser = await db.users.deserialize(user._id);

      return getAccessToken(deserializedUser);
    },

    loginOAuth: async (
      parentIgnored: unknown,
      args: { user: User.OAuthInput },
      { db }: ApolloServerContext
    ): Promise<AccessToken | null> => {
      const validator = yup
        .object()
        .shape({
          user: yup
            .object()
            .shape({
              email: yup.string().email().required(),
              firstName: yup.string().required(),
              lastName: yup.string().required(),
              provider: yup.string().required(),
              tokenId: yup.string().required(),
            })
            .required(),
        })
        .required();

      validateArgs(validator, args);

      const { user } = args;

      const authUser = await db.users.authenticateOAuth(user);

      const deserializedUser = await db.users.deserialize(authUser._id);
      return getAccessToken(deserializedUser);
    },

    requestInvite: async (
      parentIgnored: unknown,
      args: { email: string },
      { db }: ApolloServerContext
    ): Promise<boolean | null> => {
      const validator = yup
        .object()
        .shape({
          email: yup.string().email().required(),
        })
        .required();

      validateArgs(validator, args);

      const { email } = args;

      const stubUser = await db.users.requestInvite(email);

      if (!stubUser.emailToken) {
        throw new UnprocessableEntityError("Email token not found.");
      }

      return PrometheusMailer.sendInviteCode(email, stubUser.emailToken);
    },

    requestPasswordReset: async (
      parentIgnored: unknown,
      args: { email: string },
      { db }: ApolloServerContext
    ): Promise<boolean> => {
      const validator = yup
        .object()
        .shape({
          email: yup.string().email().required(),
        })
        .required();

      validateArgs(validator, args);

      const { email } = args;

      const emailToken = await db.users.requestPasswordReset(email);

      const token = getResetToken(email, emailToken);
      return PrometheusMailer.sendForgotPassword(email, token);
    },

    resetPassword: async (
      parentIgnored: unknown,
      args: { password: string; token: string },
      { db }: ApolloServerContext
    ): Promise<AccessToken | null> => {
      const validator = yup
        .object()
        .shape({
          password: yup.string().required(),
          token: yup.string().required(),
        })
        .required();

      validateArgs(validator, args);

      const { token, password } = args;

      const payload = decodeToken(token);

      const { email, tkn } = payload as ResetTokenPayload;
      const user = await db.users.resetPassword(password, email, tkn);

      const deserializedUser = await db.users.deserialize(user._id);
      return getAccessToken(deserializedUser);
    },

    inviteUser: secureEndpoint(
      async (
        parentIgnored,
        args: { email: string },
        { db, user }
      ): Promise<boolean | null> => {
        const validator = yup
          .object()
          .shape({
            email: yup.string().email().required(),
          })
          .required();

        validateArgs(validator, args);

        const { email } = args;

        const stubUser = await db.users.invite(user._id, email);
        if (!stubUser.emailToken) {
          throw new UnprocessableEntityError("Email token not found.");
        }

        return PrometheusMailer.sendInviteCode(email, stubUser.emailToken);
      }
    ),

    updateSettings: secureEndpoint(
      async (
        parentIgnored,
        args: { settings: Settings },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            settings: yup
              .object()
              .shape({
                interests: yup.array().of(yup.string().required()),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { settings } = args;

        return db.users.updateSettings(user._id, settings);
      }
    ),

    createPost: secureEndpoint(
      async (
        parentIgnored,
        args: { post: Post.Input },
        { db, user }
      ): Promise<Post.Mongo> => {
        const validator = yup
          .object()
          .shape({
            post: yup
              .object()
              .shape({
                audience: yup
                  .string()
                  .oneOf(Object.values(AudienceOptions))
                  .required(),
                categories: yup.array().of(yup.string().required()).required(),
                body: yup.string(),
                mediaUrl: yup.string().url(),
                mentionIds: yup
                  .array()
                  .of(yup.string().length(24, "Invalid mention id")),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { post } = args;

        const postData = await db.posts.create(post, user._id);

        const isAdded = await db.users.addPost(postData._id, user._id);

        if (!isAdded) {
          throw new InternalServerError("Not able to create a post");
        }

        return postData;
      }
    ),

    featurePost: secureEndpoint(
      async (
        parentIgnored,
        args: { postId: string; feature: boolean },
        { db, user }
      ): Promise<Post.Mongo> => {
        const validator = yup
          .object()
          .shape({
            postId: yup.string().length(24, "Invalid post id").required(),
            feature: yup.bool().required(),
          })
          .required();

        validateArgs(validator, args);

        const { postId, feature } = args;

        return db.posts.feature(postId, user._id, feature);
      }
    ),

    likePost: secureEndpoint(
      async (
        parentIgnored,
        args: { postId: string; like: boolean },
        { db, user }
      ): Promise<Post.Mongo> => {
        const validator = yup
          .object()
          .shape({
            postId: yup.string().length(24, "Invalid post id").required(),
            like: yup.bool().required(),
          })
          .required();

        validateArgs(validator, args);

        const { like, postId } = args;

        return like
          ? db.posts.likePost(postId, user._id)
          : db.posts.unlikePost(postId, user._id);
      }
    ),

    reportPost: secureEndpoint(
      async (
        parentIgnored,
        args: { report: ReportedPost },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            report: yup
              .object()
              .shape({
                postId: yup.string().length(24, "Invalid post id").required(),
                comments: yup.string().required(),
                violations: yup.array().of(yup.string().required()).required(),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { report } = args;

        const postData = await db.posts.find(report.postId);
        if (!postData) {
          throw new NotFoundError("Post");
        }

        return (
          (await db.users.reportPost(report, user._id)) &&
          (await db.posts.logReport(report.postId, user._id))
        );
      }
    ),

    hidePost: secureEndpoint(
      async (
        parentIgnored,
        args: { postId: string; hide: boolean },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            postId: yup.string().length(24, "Invalid post id").required(),
            hide: yup.bool().required(),
          })
          .required();

        validateArgs(validator, args);

        const { hide, postId } = args;

        const postData = await db.posts.find(postId);
        if (!postData) {
          throw new NotFoundError("Post");
        }

        return db.users.hidePost(hide, postId, user._id);
      }
    ),

    mutePost: secureEndpoint(
      async (
        parentIgnored,
        args: { postId: string; mute: boolean },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            postId: yup.string().length(24, "Invalid post id").required(),
            mute: yup.bool().required(),
          })
          .required();

        validateArgs(validator, args);

        const { mute, postId } = args;

        const postData = await db.posts.find(postId);
        if (!postData) {
          throw new NotFoundError("Post");
        }

        return db.users.mutePost(mute, postId, user._id);
      }
    ),

    comment: secureEndpoint(
      async (
        parentIgnored,
        args: { comment: Comment.Input },
        { db, user }
      ): Promise<Comment.Mongo> => {
        const validator = yup
          .object()
          .shape({
            comment: yup
              .object()
              .shape({
                postId: yup.string().length(24, "Invalid post id").required(),
                body: yup.string().required(),
                mentionIds: yup
                  .array()
                  .of(yup.string().length(24, "Invalid mention id")),
                commentId: yup.string().length(24, "Invalid comment id"),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { comment } = args;

        const postData = await db.posts.find(comment.postId);
        if (!postData) {
          throw new NotFoundError("Post");
        }

        return db.comments.create(comment, user._id);
      }
    ),

    editComment: secureEndpoint(
      async (
        parentIgnored,
        args: { comment: Comment.Update },
        { db, user }
      ): Promise<Comment.Mongo> => {
        const validator = yup
          .object()
          .shape({
            comment: yup
              .object()
              .shape({
                _id: yup.string().length(24, "Invalid comment id"),
                body: yup.string().required(),
                mentionIds: yup
                  .array()
                  .of(yup.string().length(24, "Invalid mention id")),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { comment } = args;

        return db.comments.edit(comment, user._id);
      }
    ),

    deleteComment: secureEndpoint(
      async (
        parentIgnored,
        args: { commentId: string },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            commentId: yup.string().length(24, "Invalid comment id").required(),
          })
          .required();

        validateArgs(validator, args);

        const { commentId } = args;

        return db.comments.delete(commentId, user._id);
      }
    ),

    /**
     * Provides a signed AWS S3 upload link that can be used for a one-time
     * client-side upload of a file to an S3 bucket.
     */
    uploadLink: secureEndpoint(
      async (
        parentIgnored,
        args: { localFilename: string; type: MediaType },
        { db, user }
      ): Promise<RemoteUpload | null> => {
        const validator = yup
          .object()
          .shape({
            localFilename: yup.string().required(),
            type: yup.string().oneOf(["POST", "AVATAR", "BACKGROUND"]),
          })
          .required();

        validateArgs(validator, args);

        const { localFilename, type } = args;

        const fileExt = localFilename.substring(
          localFilename.lastIndexOf(".") + 1
        );
        const uploadInfo = await getUploadUrl(
          fileExt,
          type.toLowerCase() as Lowercase<MediaType>
        );
        return uploadInfo;
      }
    ),

    watchFund: secureEndpoint(
      async (
        parentIgnored,
        args: { fundId: string; watch: boolean },
        { db, user }
      ): Promise<Boolean> => {
        const validator = yup
          .object()
          .shape({
            watch: yup.bool().required(),
            fundId: yup.string().length(24, "Invalid fund id").required(),
          })
          .required();

        validateArgs(validator, args);

        const { fundId, watch } = args;

        if (!watch) {
          return db.users.setOnWatchlist(false, fundId, user._id);
        }

        // Check that the user has access to this fund if adding to watclist
        const fund = await db.funds.find(fundId);
        if (!fund) {
          throw new NotFoundError("Fund");
        }
        if (compareAccreditation(user.accreditation, fund.level) < 0) {
          return false;
        }

        return db.users.setOnWatchlist(true, fundId, user._id);
      }
    ),

    followUser: secureEndpoint(
      async (
        parentIgnored,
        args: { follow: boolean; userId: string; asCompanyId?: string },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            follow: yup.bool().required(),
            userId: yup.string().length(24, "Invalid user id").required(),
            asCompanyId: yup.string().length(24, "Invalid company id"),
          })
          .required();

        validateArgs(validator, args);

        const { follow, userId, asCompanyId } = args;

        if (userId === user._id.toString()) {
          throw new UnprocessableEntityError("Invalid user");
        }

        if (asCompanyId) {
          // Check company exists
          const companyData = await db.companies.find(asCompanyId);
          if (!companyData) {
            throw new NotFoundError("Company");
          }

          return (
            (await db.users.setFollowerCompany(follow, asCompanyId, userId)) &&
            (await db.companies.setFollowingUser(follow, userId, asCompanyId))
          );
        }

        // Check company exists
        const userData = await db.users.find({ _id: userId });
        if (!userData) {
          throw new NotFoundError();
        }

        return (
          (await db.users.setFollowingUser(follow, userId, user._id)) &&
          (await db.users.setFollower(follow, user._id, userId))
        );
      }
    ),

    followCompany: secureEndpoint(
      async (
        parentIgnored,
        args: { follow: boolean; companyId: string; asCompanyId?: string },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            follow: yup.bool().required(),
            companyId: yup.string().length(24, "Invalid company id").required(),
            asCompanyId: yup.string().length(24, "Invalid company id"),
          })
          .required();

        validateArgs(validator, args);

        const { follow, companyId, asCompanyId } = args;

        if (companyId === asCompanyId) {
          throw new UnprocessableEntityError("Invalid company");
        }

        const companyData = await db.companies.find(companyId);
        if (!companyData) {
          throw new NotFoundError("Company");
        }

        if (asCompanyId) {
          const asCompanyData = await db.companies.find(asCompanyId);
          if (!asCompanyData) {
            throw new NotFoundError("Company");
          }

          return (
            (await db.companies.setFollowingCompany(
              follow,
              companyId,
              asCompanyId
            )) &&
            (await db.companies.setFollowerCompany(
              follow,
              asCompanyId,
              companyId
            ))
          );
        }

        return (
          (await db.companies.setFollower(follow, user._id, companyId)) &&
          (await db.users.setFollowingCompany(follow, companyId, user._id))
        );
      }
    ),

    hideUser: secureEndpoint(
      async (
        parentIgnored,
        args: { hide: boolean; userId: string },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            hide: yup.bool().required(),
            userId: yup.string().length(24, "Invalid user id").required(),
          })
          .required();

        validateArgs(validator, args);

        const { hide, userId } = args;

        const userData = await db.users.find({ _id: userId });
        if (!userData) {
          throw new NotFoundError();
        }

        return db.users.setHideUser(hide, userId, user._id);
      }
    ),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
