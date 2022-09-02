import { ApolloServer, gql } from "apollo-server-express";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
import { User } from "../../../schemas/user";
import { createUser, getErrorCode, getFieldError } from "../../config/utils";

describe("Mutations - login", () => {
  const query = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password)
    }
  `;

  let server: ApolloServer;
  let user: User.Mongo;

  beforeAll(async () => {
    server = createTestApolloServer();
    user = await createUser();
  });

  it("returns access token", async () => {
    const res = await server.executeOperation({
      query,
      variables: { email: user?.email, password: "test-pass" },
    });

    expect(res.data).toHaveProperty("login");
    expect(res.data?.login?.length).toBeGreaterThan(0);
  });

  it("returns access token with wrong email case", async () => {
    const res = await server.executeOperation({
      query,
      variables: { email: user?.email.toUpperCase(), password: "test-pass" },
    });

    expect(res.data).toHaveProperty("login");
    expect(res.data?.login?.length).toBeGreaterThan(0);
  });

  it("fails with empty variables", async () => {
    const res = await server.executeOperation({
      query,
      variables: { email: "", password: "" },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "email")).toBeDefined();
    expect(getFieldError(res, "password")).toBeDefined();
  });

  it("fails with invalid email", async () => {
    const res = await server.executeOperation({
      query,
      variables: { email: "test", password: "test-pass" },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "email")).toBeDefined();
  });

  it("fails with invalid password", async () => {
    const res = await server.executeOperation({
      query,
      variables: { email: user?.email, password: "test-pass-test" },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "password")).toBeDefined();
  });

  it("fails with non-registered user", async () => {
    const res = await server.executeOperation({
      query,
      variables: { email: "test@test.com", password: "test-pass" },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });
});
