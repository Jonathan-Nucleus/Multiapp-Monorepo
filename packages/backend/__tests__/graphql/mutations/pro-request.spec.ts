import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import { createUser, getErrorCode } from "../../config/utils";

describe("Mutations - proRequest", () => {
  const query = gql`
    mutation ProRequest($request: ProRequestInput!) {
      proRequest(request: $request)
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;

  const requestData = {
    role: "MANAGER",
    email: faker.internet.email(),
    position: "Test position",
  };

  beforeAll(async () => {
    authUser = await createUser();
    server = createTestApolloServer(authUser);
  });

  it("fails with empty variables", async () => {
    const res = await server.executeOperation({
      query,
      variables: {},
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with empty role", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        request: {
          role: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with empty position", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        position: "",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with no organization and other role", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        request: {
          ...requestData,
          role: "OTHER",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("succeeds with role not other and no organization", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        request: {
          ...requestData,
        },
      },
    });

    expect(res.data).toHaveProperty("proRequest");
    expect(res.data?.proRequest).toBeTruthy();
  });

  it("succeeds with other role and organization", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        request: {
          ...requestData,
          role: "OTHER",
          organization: "test organizations",
        },
      },
    });

    expect(res.data).toHaveProperty("proRequest");
    expect(res.data?.proRequest).toBeTruthy();
  });
});
