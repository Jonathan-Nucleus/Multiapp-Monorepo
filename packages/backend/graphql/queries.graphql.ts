import { gql } from "apollo-server";
import {
  PartialSchema,
  ApolloServerContext,
  NoArgs,
  secureEndpoint,
} from "../lib/apollo-helper";

import { User, isUser, compareAccreditation } from "../schemas/user";
import type { Company } from "../schemas/company";
import type { Post, PostCategory } from "../schemas/post";
import type { Fund } from "../schemas/fund";

const schema = gql`
  type Query {
    verifyInvite(code: String!): Boolean!
    posts(categories: [PostCategory!]): [Post!]
    account: User
    funds: [Fund!]
    fund(fundId: ID!): Fund
    fundManagers: FundManagers
    userProfile(userId: ID!): UserProfile
    companyProfile(companyId: ID!): Company
  }

  type FundManagers {
    managers: [User!]!
    funds: [Fund!]!
  }
`;

export type FundManagers = {
  managers: User.Mongo[];
  funds: Fund.Mongo[];
};

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
          user.accreditation === "none" ? "everyone" : user.accreditation,
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
      ): Promise<User.Mongo | null> => user
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
        { fundId }: { fundId: string },
        { db, user }
      ): Promise<Fund.Mongo | null> => {
        const fund = await db.funds.find(fundId);
        if (!fund) return null;

        return compareAccreditation(user.accreditation, fund.level) >= 0
          ? fund
          : null;
      }
    ),

    fundManagers: secureEndpoint(
      async (
        parentIgnored,
        argsIgnored,
        { db, user }
      ): Promise<FundManagers> => {
        const managers = await db.users.fundManagers();
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

    userProfile: secureEndpoint(
      async (
        parentIgnored,
        { userId }: { userId: string },
        { db, user }
      ): Promise<User.Mongo | null> =>
        (await db.users.find({ _id: userId })) as User.Mongo | null
    ),

    companyProfile: secureEndpoint(
      async (
        parentIgnored,
        { companyId }: { companyId: string },
        { db, user }
      ): Promise<Company.Mongo | null> => db.companies.find(companyId)
    ),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
