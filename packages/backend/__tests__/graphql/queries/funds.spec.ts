import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import { createTestApolloServer } from "../../../lib/server";
import { User } from "../../../schemas/user";
import { createCompany, createFund, createUser } from "../../config/utils";
import { Fund } from "../../../schemas/fund";
import { Company } from "../../../schemas/company";

describe("Query - funds", () => {
  const query = gql`
    query Funds {
      funds {
        _id
        name
        level
        manager {
          _id
          firstName
          lastName
        }
        company {
          _id
          name
        }
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo | null;
  let company1: Company.Mongo | null;
  let funds: Fund.Mongo[];

  beforeAll(async () => {
    authUser = await createUser("user", "client");
    company1 = await createCompany(authUser?._id);
    funds = (await Promise.all([
      await createFund(authUser?._id, company1?._id, "accredited"),
      await createFund(authUser?._id, company1?._id, "client"),
      await createFund(authUser?._id, company1?._id, "purchaser"),
    ])) as Fund.Mongo[];

    server = createTestApolloServer(authUser);
  });

  it("succeeds to get all funds", async () => {
    const res = await server.executeOperation({
      query,
    });

    expect(res.data?.funds).toHaveLength(2);
    const fundIds = _.map(res.data?.funds, "_id");
    expect(fundIds).toContain(funds[0]._id.toString());
    expect(fundIds).toContain(funds[1]._id.toString());
  });
});
