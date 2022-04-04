import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
  AccessToken,
  secureEndpoint,
  getAccessToken,
} from "backend/lib/apollo-helper";

import type { User } from "backend/schemas/user";

const schema = gql`
  type Mutation {
    register(user: UserInput!): String
    requestInvite(email: String!): Boolean!
    inviteUser(email: String!): Boolean!
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
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
