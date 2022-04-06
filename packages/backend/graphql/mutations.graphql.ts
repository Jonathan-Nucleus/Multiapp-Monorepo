import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
  AccessToken,
  secureEndpoint,
  getAccessToken,
} from "backend/lib/apollo-helper";

import { User, Settings, isUser } from "backend/schemas/user";

const schema = gql`
  type Mutation {
    register(user: UserInput!): String
    login(email: String!, password: String!): String
    loginOAuth(user: OAuthUserInput!): String
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
    ): Promise<boolean | null> => !!db.users.requestInvite(email),

    inviteUser: secureEndpoint(
      async (
        parentIgnored,
        { email }: { email: string },
        { db, user }
      ): Promise<boolean | null> => db.users.invite(user._id, email)
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
