import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server";
import { StreamChat } from "stream-chat";
import { createTestApolloServer } from "../../../lib/server";
import { User } from "../../../schemas/user";
import { createUser } from "../../config/utils";

jest.mock("getstream");

describe("Query - chatToken", () => {
  const query = gql`
    query ChatToken {
      chatToken
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;

  beforeAll(async () => {
    authUser = await createUser();
    server = createTestApolloServer(authUser);
  });

  it("succeeds to get a token", async () => {
    const testToken = faker.datatype.uuid();

    const spy = jest.spyOn(StreamChat, "getInstance").mockImplementation(
      () =>
        ({
          createToken: jest.fn().mockImplementation(() => testToken),
        } as never)
    );

    const res = await server.executeOperation({
      query,
    });

    expect(res.data?.chatToken).toBe(testToken);

    spy.mockRestore();
  });
});
