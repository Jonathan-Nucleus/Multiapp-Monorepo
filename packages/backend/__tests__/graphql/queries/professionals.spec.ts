import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { User } from "../../../schemas/user";
import { createUser } from "../../config/utils";

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
  let authUser: User.Mongo;

  beforeAll(async () => {
    authUser = await createUser("user");
    const usersIgnored = (await Promise.all([
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
