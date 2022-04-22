import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import { createTestApolloServer } from "../../../lib/server";
import { User } from "../../../schemas/user";
import { createCompany, createFund, createUser } from "../../config/utils";
import { Company } from "../../../schemas/company";
import { Fund } from "../../../schemas/fund";

describe("Query - professionals", () => {
  const query = gql`
    query Professionals($featured: Boolean) {
      professionals(featured: $featured) {
        _id
        firstName
        lastName
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo | null;
  let users: User.Mongo[];

  beforeAll(async () => {
    authUser = await createUser("user");
    users = (await Promise.all([
      await createUser("professional", "none"),
      await createUser("professional", "none"),
      await createUser("professional", "none", true),
    ])) as User.Mongo[];

    server = createTestApolloServer(authUser);
  });

  it("succeeds to get professionals", async () => {
    const res = await server.executeOperation({
      query,
    });

    expect(res.data?.professionals).toHaveLength(3);
  });

  it("succeeds to get featured professionals", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        featured: true,
      },
    });

    expect(res.data?.professionals).toHaveLength(1);
  });
});
