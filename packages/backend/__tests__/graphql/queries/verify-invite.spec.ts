import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import { createUser, getErrorCode, getFieldError } from "../../config/utils";

describe("Query - verifyInvite", () => {
  const query = gql`
    query VerifyInvite($code: String!) {
      verifyInvite(code: $code)
    }
  `;

  let server: ApolloServer;
  let user: User.Mongo | null;

  beforeAll(async () => {
    user = await createUser();
    server = createTestApolloServer();
  });

  it("fails without code", async () => {
    const res = await server.executeOperation({
      query,
      variables: {},
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with empty code", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        code: "",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "code")).toBeDefined();
  });

  it("fails with invalid code", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        code: "test",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "code")).toBeDefined();
  });

  it("succeeds to verify the code", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        code: user?.emailToken,
      },
    });

    expect(res.data?.verifyInvite).toBeTruthy();
  });
});
