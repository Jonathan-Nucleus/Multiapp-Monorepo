import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { User } from "../../../schemas/user";
import { createCompany, createFund, createUser } from "../../config/utils";
import { Company } from "../../../schemas/company";

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
  let authUser: User.Mongo;
  let user1: User.Mongo;
  let companies: Company.Mongo[];

  beforeAll(async () => {
    authUser = await createUser("user", "accredited");
    user1 = await createUser("user", "client", true);
    companies = (await Promise.all([
      await createCompany(authUser._id),
      await createCompany(authUser._id),
      await createCompany(user1._id),
    ])) as Company.Mongo[];
    await Promise.all([
      await createFund(authUser._id, companies[0]._id, "accredited"),
      await createFund(authUser._id, companies[0]._id, "client"),
      await createFund(authUser._id, companies[1]._id, "accredited"),
      await createFund(authUser._id, companies[1]._id, "client"),
      await createFund(user1._id, companies[1]._id, "client"),
    ]);
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
