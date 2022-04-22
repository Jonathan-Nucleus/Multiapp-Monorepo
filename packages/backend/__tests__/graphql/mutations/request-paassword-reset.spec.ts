import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import {
  createStub,
  createUser,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { PrometheusMailer } from "../../../email";

describe("Mutations - requestPasswordReset", () => {
  const query = gql`
    mutation RequestPasswordReset($email: String!) {
      requestPasswordReset(email: $email)
    }
  `;

  let server: ApolloServer;
  let stub: User.Stub | null;
  let user: User.Mongo | null;
  const email = faker.internet.email();

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

  it("fails with empty email", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        email: "",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "email")).toBeDefined();
  });

  it("fails with invalid email", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        email: "test",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "email")).toBeDefined();
  });

  it("fails with non-registered email", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        email,
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("fails with stub user's email", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        email: stub?.email,
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });

  it("succeeds with registered user's email", async () => {
    const spy = jest
      .spyOn(PrometheusMailer, "sendForgotPassword")
      .mockResolvedValueOnce(true);

    const res = await server.executeOperation({
      query,
      variables: {
        email: user?.email,
      },
    });

    expect(res.data).toHaveProperty("requestPasswordReset");
    expect(res.data?.requestPasswordReset).toBeTruthy();

    spy.mockRestore();
  });
});
