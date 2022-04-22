import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import { createTestApolloServer } from "../../../lib/server";
import { User } from "../../../schemas/user";
import { createCompany, createFund, createUser } from "../../config/utils";
import { Company } from "../../../schemas/company";
import { Fund } from "../../../schemas/fund";

describe("Query - fundManagers", () => {
  const query = gql`
    query FundManagers($featured: Boolean) {
      fundManagers(featured: $featured) {
        funds {
          _id
          name
          level
        }
        managers {
          _id
          firstName
          lastName
          avatar
          managedFundsIds
        }
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo | null;
  let user1: User.Mongo | null;
  let companies: Company.Mongo[];
  let funds: Fund.Mongo[];

  beforeAll(async () => {
    authUser = await createUser("user", "accredited");
    user1 = await createUser("user", "client", true);
    companies = (await Promise.all([
      await createCompany(authUser?._id),
      await createCompany(authUser?._id),
      await createCompany(user1?._id),
    ])) as Company.Mongo[];
    funds = (await Promise.all([
      await createFund(authUser?._id, companies[0]?._id, "accredited"),
      await createFund(authUser?._id, companies[0]?._id, "client"),
      await createFund(authUser?._id, companies[1]?._id, "accredited"),
      await createFund(authUser?._id, companies[1]?._id, "client"),
      await createFund(user1?._id, companies[1]?._id, "client"),
    ])) as Fund.Mongo[];
    server = createTestApolloServer(authUser);
  });

  it("succeeds to get fund managers", async () => {
    const res = await server.executeOperation({
      query,
    });

    expect(res.data?.fundManagers.managers).toHaveLength(2);
  });

  it("succeeds to get featured fund managers", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        featured: true,
      },
    });

    expect(res.data?.fundManagers.managers).toHaveLength(1);
  });
});
