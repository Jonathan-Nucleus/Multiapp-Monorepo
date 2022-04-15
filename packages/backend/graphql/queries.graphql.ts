import { gql } from "apollo-server";
import * as yup from "yup";
import {
  PartialSchema,
  ApolloServerContext,
  secureEndpoint,
} from "../lib/apollo-helper";
import { NotFoundError, validateArgs } from "../lib/validate";

import { User, isUser, compareAccreditation } from "../schemas/user";
import type { Company } from "../schemas/company";
import type { Post, PostCategory } from "../schemas/post";
import type { Fund } from "../schemas/fund";

const schema = gql`
  type Query {
    verifyInvite(code: String!): Boolean!
    account: User
    posts(categories: [PostCategory!]): [Post!]
    funds: [Fund!]
    fund(fundId: ID!): Fund
    fundManagers(featured: Boolean): FundManagers
    fundCompanies: [Company!]
    professionals(featured: Boolean): [UserProfile!]
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
      args: { code: string },
      { db }: ApolloServerContext
    ): Promise<boolean> => {
      const validator = yup
        .object()
        .shape({
          code: yup.string().uuid().required(),
        })
        .required();

      validateArgs(validator, args);

      const { code } = args;

      return db.users.verifyInvite(code);
    },

    posts: secureEndpoint(
      async (
        parentIgnored,
        args: { categories?: PostCategory[] },
        { db, user }
      ): Promise<Post.Mongo[]> => {
        const validator = yup
          .object()
          .shape({
            categories: yup.array().of(yup.string().required()),
          })
          .required();

        validateArgs(validator, args);

        const { categories } = args;

        const userData = await db.users.find({ _id: user._id });
        if (!userData || !isUser(userData)) {
          throw new NotFoundError();
        }

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
        args: { fundId: string },
        { db, user }
      ): Promise<Fund.Mongo | null> => {
        const validator = yup
          .object()
          .shape({
            fundId: yup.string().length(24, "Invalid fund id").required(),
          })
          .required();

        validateArgs(validator, args);

        const { fundId } = args;

        const fund = await db.funds.find(fundId);
        if (!fund) {
          throw new NotFoundError("Fund");
        }

        return compareAccreditation(user.accreditation, fund.level) >= 0
          ? fund
          : null;
      }
    ),

    fundManagers: secureEndpoint(
      async (
        parentIgnored,
        args: { featured?: boolean },
        { db, user }
      ): Promise<FundManagers> => {
        const validator = yup.object().shape({
          featured: yup.bool(),
        });

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
      async (
        parentIgnored,
        argsIgnored,
        { db, user }
      ): Promise<Company.Mongo[]> => db.companies.fundCompanies()
    ),

    professionals: secureEndpoint(
      async (
        parentIgnored,
        { featured = false }: { featured?: boolean },
        { db, user }
      ): Promise<User.Mongo[]> => db.users.professionals(featured)
    ),

    userProfile: secureEndpoint(
      async (
        parentIgnored,
        args: { userId: string },
        { db, user }
      ): Promise<User.Mongo | User.Stub> => {
        const validator = yup
          .object()
          .shape({
            userId: yup.string().length(24, "Invalid user id").required(),
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
        { db, user }
      ): Promise<Company.Mongo> => {
        const validator = yup
          .object()
          .shape({
            companyId: yup.string().length(24, "Invalid company id").required(),
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
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
