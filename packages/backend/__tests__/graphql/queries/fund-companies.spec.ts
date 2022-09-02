import { ApolloServer, gql } from "apollo-server-express";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { User } from "../../../schemas/user";
import { createCompany, createFund, createUser } from "../../config/utils";
import { Company } from "../../../schemas/company";
import { Fund } from "../../../schemas/fund";

describe("Query - fundCompanies", () => {
  const query = gql`
    query FundCompanies {
      fundCompanies {
        _id
        name
        funds {
          _id
          name
        }
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let user1: User.Mongo;
  let companies: Company.Mongo[];
  let funds: Fund.Mongo[];

  beforeAll(async () => {
    authUser = await createUser("user", "accredited");
    user1 = await createUser("user", "client");
    companies = (await Promise.all([
      await createCompany(authUser._id),
      await createCompany(authUser._id),
      await createCompany(user1._id),
    ])) as Company.Mongo[];
    funds = (await Promise.all([
      await createFund(authUser._id, companies[0]._id, "accredited"),
      await createFund(authUser._id, companies[0]._id, "client"),
      await createFund(authUser._id, companies[1]._id, "accredited"),
      await createFund(authUser._id, companies[1]._id, "client"),
    ])) as Fund.Mongo[];
    server = createTestApolloServer(authUser);
  });

  it("succeeds to get fund companies", async () => {
    const res = await server.executeOperation({
      query,
    });

    expect(res.data?.fundCompanies).toHaveLength(
      funds.filter((item) => item.level === "accredited").length
    );
  });
});
