import { gql } from "apollo-server";
import { PrometheusMailer } from "backend/email";

import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
  secureEndpoint,
} from "backend/lib/apollo-helper";
import {
  getAccessToken,
  getResetToken,
  decodeToken,
  AccessToken,
  ResetTokenPayload,
} from "backend/lib/tokens";

import { User, Settings, ReportedPost, isUser } from "backend/schemas/user";
import type { Post } from "backend/schemas/post";
import type { Comment } from "backend/schemas/comment";

const schema = gql`
  type Mutation {
    register(user: UserInput!): String
    login(email: String!, password: String!): String
    loginOAuth(user: OAuthUserInput!): String
    requestPasswordReset(email: String!): Boolean!
    resetPassword(password: String!, token: String!): String
    requestInvite(email: String!): Boolean
    inviteUser(email: String!): Boolean!
    updateSettings(settings: SettingsInput!): Boolean!

    createPost(post: PostInput!): Post
    likePost(like: Boolean!, postId: ID!): Boolean!
    reportPost(report: ReportedPostInput!): Boolean!
    hidePost(hide: Boolean!, postId: ID!): Boolean!
    mutePost(mute: Boolean!, postId: ID!): Boolean!
    comment(comment: CommentInput!): Comment
    editComment(comment: CommentUpdate!): Comment
    deleteComment(commentId: ID!): Boolean!

    followUser(follow: Boolean!, userId: ID!, asCompanyId: ID): Boolean!
    followCompany(follow: Boolean!, companyId: ID!, asCompanyId: ID): Boolean!
    hideUser(hide: Boolean!, userId: ID!): Boolean!
  }
`;

const resolvers = {
  Mutation: {
    register: async (
      parentIgnored: unknown,
      { user }: { user: User.Input },
      { db }: ApolloServerContext
    ): Promise<AccessToken | null> => {
      const userId = await db.users.register(user);
      if (!userId) return null;

      const deserializedUser = await db.users.deserialize(userId);
      return deserializedUser ? getAccessToken(deserializedUser) : null;
    },

    login: async (
      parentIgnored: User.Mongo,
      { email, password }: { email: string; password: string },
      { db }: ApolloServerContext
    ): Promise<AccessToken | null> => {
      const user = await db.users.authenticate(email, password);
      if (!user) return null;

      const deserializedUser = await db.users.deserialize(user._id);
      return deserializedUser ? getAccessToken(deserializedUser) : null;
    },

    loginOAuth: async (
      parentIgnored: unknown,
      { user }: { user: User.OAuthInput },
      { db }: ApolloServerContext
    ): Promise<AccessToken | null> => {
      const authUser = await db.users.authenticateOAuth(user);
      if (!authUser || !isUser(authUser)) return null;

      const deserializedUser = await db.users.deserialize(authUser._id);
      return deserializedUser ? getAccessToken(deserializedUser) : null;
    },

    requestInvite: async (
      parentIgnored: unknown,
      { email }: { email: string },
      { db }: ApolloServerContext
    ): Promise<boolean | null> => {
      const stubUser = await db.users.requestInvite(email);
      if (!stubUser || !stubUser.emailToken) return null;

      return PrometheusMailer.sendInviteCode(email, stubUser.emailToken);
    },

    requestPasswordReset: async (
      parentIgnored: unknown,
      { email }: { email: string },
      { db }: ApolloServerContext
    ): Promise<boolean> => {
      const emailToken = await db.users.requestPasswordReset(email);
      if (!emailToken) return false;

      const token = getResetToken(email, emailToken);
      return PrometheusMailer.sendForgotPassword(email, token);
    },

    resetPassword: async (
      parentIgnored: unknown,
      { password, token }: { password: string; token: string },
      { db }: ApolloServerContext
    ): Promise<AccessToken | null> => {
      const payload = decodeToken(token);
      if (!payload) return null;

      const { email, tkn } = payload as ResetTokenPayload;
      const user = await db.users.resetPassword(password, email, tkn);
      if (!user) return null;

      const deserializedUser = await db.users.deserialize(user._id);
      return deserializedUser ? getAccessToken(deserializedUser) : null;
    },

    inviteUser: secureEndpoint(
      async (
        parentIgnored,
        { email }: { email: string },
        { db, user }
      ): Promise<boolean | null> => {
        const stubUser = await db.users.invite(user._id, email);
        if (!stubUser || !stubUser.emailToken) return null;

        return PrometheusMailer.sendInviteCode(email, stubUser.emailToken);
      }
    ),

    updateSettings: secureEndpoint(
      async (
        parentIgnored,
        { settings }: { settings: Settings },
        { db, user }
      ): Promise<boolean> => db.users.updateSettings(user._id, settings)
    ),

    createPost: secureEndpoint(
      async (
        parentIgnored,
        { post }: { post: Post.Input },
        { db, user }
      ): Promise<Post.Mongo | null> => db.posts.create(post, user._id)
    ),

    likePost: secureEndpoint(
      async (
        parentIgnored,
        { postId, like }: { postId: string; like: boolean },
        { db, user }
      ): Promise<boolean> =>
        like
          ? db.posts.likePost(postId, user._id)
          : db.posts.unlikePost(postId, user._id)
    ),

    reportPost: secureEndpoint(
      async (
        parentIgnored,
        { report }: { report: ReportedPost },
        { db, user }
      ): Promise<boolean> => {
        const postData = db.posts.find(report.postId);
        if (!postData) return false;

        return (
          (await db.users.reportPost(report, user._id)) &&
          (await db.posts.logReport(report.postId, user._id))
        );
      }
    ),

    hidePost: secureEndpoint(
      async (
        parentIgnored,
        { postId, hide }: { postId: string; hide: boolean },
        { db, user }
      ): Promise<boolean> => {
        const postData = db.posts.find(postId);
        if (!postData) return false;

        return db.users.hidePost(hide, postId, user._id);
      }
    ),

    mutePost: secureEndpoint(
      async (
        parentIgnored,
        { postId, mute }: { postId: string; mute: boolean },
        { db, user }
      ): Promise<boolean> => {
        const postData = db.posts.find(postId);
        if (!postData) return false;

        return db.users.mutePost(mute, postId, user._id);
      }
    ),

    comment: secureEndpoint(
      async (
        parentIgnored,
        { comment }: { comment: Comment.Input },
        { db, user }
      ): Promise<Comment.Mongo | null> => {
        const postData = db.posts.find(comment.postId);
        if (!postData) return null;

        return db.comments.create(comment, user._id);
      }
    ),

    editComment: secureEndpoint(
      async (
        parentIgnored,
        { comment }: { comment: Comment.Update },
        { db, user }
      ): Promise<Comment.Mongo | null> => db.comments.edit(comment, user._id)
    ),

    deleteComment: secureEndpoint(
      async (
        parentIgnored,
        { commentId }: { commentId: string },
        { db, user }
      ): Promise<boolean> => db.comments.delete(commentId, user._id)
    ),

    followUser: secureEndpoint(
      async (
        parentIgnored,
        {
          follow,
          userId,
          asCompanyId,
        }: { follow: boolean; userId: string; asCompanyId?: string },
        { db, user }
      ): Promise<boolean> => {
        if (userId === user._id) return false;
        if (asCompanyId) {
          // Check company exists
          const companyData = await db.companies.find(asCompanyId);
          if (!companyData) return false;

          return (
            (await db.users.setFollowerCompany(follow, asCompanyId, userId)) &&
            (await db.companies.setFollowingUser(follow, userId, asCompanyId))
          );
        }

        // Check company exists
        const userData = await db.users.find({ _id: userId });
        if (!userData) return false;

        return (
          (await db.users.setFollowingUser(follow, userId, user._id)) &&
          (await db.users.setFollower(follow, user._id, userId))
        );
      }
    ),

    followCompany: secureEndpoint(
      async (
        parentIgnored,
        {
          follow,
          companyId,
          asCompanyId,
        }: { follow: boolean; companyId: string; asCompanyId?: string },
        { db, user }
      ): Promise<boolean> => {
        if (companyId === asCompanyId) return false;

        const companyData = await db.companies.find(companyId);
        if (!companyData) return false;

        if (asCompanyId) {
          const asCompanyData = await db.companies.find(asCompanyId);
          if (!asCompanyData) return false;

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
        { hide, userId }: { hide: boolean; userId: string },
        { db, user }
      ): Promise<boolean> => {
        const userData = await db.users.find({ _id: userId });
        if (!userData) return false;

        return db.users.setHideUser(hide, userId, user._id);
      }
    ),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
