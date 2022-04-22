import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import * as GetStreamModule from "getstream";
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
  let authUser: User.Mongo | null;

  beforeAll(async () => {
    authUser = await createUser();
    server = createTestApolloServer(authUser);
  });

  it("succeeds to get a token", async () => {
    const testToken = faker.datatype.uuid();

    const spy = jest.spyOn(GetStreamModule, "connect").mockImplementation(
      () =>
        ({
          createUserToken: jest.fn().mockImplementation(() => testToken),
        } as never)
    );

    const res = await server.executeOperation({
      query,
    });

    expect(res.data?.chatToken).toBe(testToken);

    spy.mockRestore();
  });
});
