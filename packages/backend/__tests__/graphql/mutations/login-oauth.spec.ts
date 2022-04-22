import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { User } from "../../../schemas/user";
import { createUser } from "../../config/utils";

// TODO: implement login oauth test
describe("Mutations - loginOAuth", () => {
  const query = gql`
    mutation LoginOAuth($user: OAuthUserInput!) {
      loginOAuth(user: $user)
    }
  `;

  let server: ApolloServer;
  let user: User.Mongo | null;

  beforeAll(async () => {
    server = createTestApolloServer();
    user = await createUser();
  });

  it("returns ok", async () => {
    expect(true).toBe(true);
  });
});
