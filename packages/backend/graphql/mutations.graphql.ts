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

import { User, Settings, isUser } from "backend/schemas/user";

const schema = gql`
  type Mutation {
    register(user: UserInput!): String
    login(email: String!, password: String!): String
    loginOAuth(user: OAuthUserInput!): String
    requestPasswordReset(email: String!): Boolean!
    resetPassword(password: String!, token: String!): String
    requestInvite(email: String!): Boolean!
    inviteUser(email: String!): Boolean!
    updateSettings(settings: SettingsInput!): Boolean!
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
      const result = await db.users.requestPasswordReset(email);
      if (!result) return false;

      const [id, emailToken] = result;
      const token = getResetToken(id, emailToken);
      return PrometheusMailer.sendForgotPassword(email, token);
    },

    resetPassword: async (
      parentIgnored: unknown,
      { password, token }: { password: string; token: string },
      { db }: ApolloServerContext
    ): Promise<AccessToken | null> => {
      const payload = decodeToken(token);
      if (!payload) return null;

      const { _id, tkn } = payload as ResetTokenPayload;
      const user = await db.users.resetPassword(password, _id, tkn);
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
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
