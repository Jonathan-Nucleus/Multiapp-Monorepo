import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
  secureEndpoint,
} from "../lib/apollo-helper";

import { User, isUser } from "../schemas/user";
import type { Post, PostCategory } from "../schemas/post";
import type { Fund } from "../schemas/fund";

const schema = gql`
  type Query {
    verifyInvite(code: String!): Boolean!
    posts(categories: [PostCategory!]): [Post!]
    account: User
    funds: [Fund!]
  }
`;

const resolvers = {
  Query: {
    verifyInvite: async (
      parentIgnored: unknown,
      { code }: { code: string },
      { db }: ApolloServerContext
    ): Promise<boolean> => db.users.verifyInvite(code),

    posts: secureEndpoint(
      async (
        parentIgnored,
        { categories }: { categories?: PostCategory[] },
        { db, user }
      ): Promise<Post.Mongo[]> => {
        const userData = await db.users.find({ _id: user._id });
        if (!userData || !isUser(userData)) return [];

        return db.posts.findByCategory(
          user.acc === "none" ? "everyone" : user.acc,
          categories,
          userData.hiddenPostIds,
          userData.hiddenUserIds
        );
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
        { db, user }
      ): Promise<User.Mongo | null> => {
        const userData = await db.users.find({ _id: user._id });
        return !userData || !isUser(userData) ? null : userData;
      }
    ),

    funds: secureEndpoint(
      async (
        parentIgnored,
        argsIgnored,
        { db, user }
      ): Promise<Fund.Mongo[]> => {
        const userData = await db.users.find({ _id: user._id });
        if (!userData || !isUser(userData)) return [];

        return db.funds.findByAccreditation(user.acc);
      }
    ),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
