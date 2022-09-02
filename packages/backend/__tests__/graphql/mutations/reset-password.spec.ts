import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server-express";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
import { User } from "../../../schemas/user";
import {
  createStub,
  createUser,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { getResetToken } from "../../../lib/tokens";

describe("Mutations - resetPassword", () => {
  const query = gql`
    mutation ResetPassword($token: String!, $password: String!) {
      resetPassword(password: $password, token: $token)
    }
  `;

  let server: ApolloServer;
  let stub: User.Stub | null;
  let user: User.Mongo;

  beforeAll(async () => {
    server = createTestApolloServer();
    stub = await createStub();
    user = await createUser();
  });

  it("fails with empty variables", async () => {
    const res = await server.executeOperation({
      query,
      variables: {},
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with empty token", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        token: "",
        password: "test-pass",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "token")).toBeDefined();
  });

  it("fails with empty password", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        token: "test-token",
        password: "",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "password")).toBeDefined();
  });

  it("fails with invalid token", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        token: "test-token",
        password: "test-pass",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_REQUEST);
  });

  it("fails with token of non-registered user's email", async () => {
    const token = getResetToken(faker.internet.email(), "email-token");
    const res = await server.executeOperation({
      query,
      variables: {
        token,
        password: "test-pass",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("fails with token of stub user", async () => {
    const token = getResetToken(stub?.email as string, "email-token");
    const res = await server.executeOperation({
      query,
      variables: {
        token,
        password: "test-pass",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });

  it("fails with invalid token of registered user", async () => {
    const token = getResetToken(user?.email as string, "email-token");
    const res = await server.executeOperation({
      query,
      variables: {
        token,
        password: "test-pass",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_REQUEST);
  });

  it("returns token with resetting password", async () => {
    const token = getResetToken(
      user?.email as string,
      user?.emailToken as string
    );
    const res = await server.executeOperation({
      query,
      variables: {
        token,
        password: "test-pass",
      },
    });

    expect(res.data).toHaveProperty("resetPassword");
    expect(res.data?.resetPassword?.length).toBeGreaterThan(0);
  });
});
