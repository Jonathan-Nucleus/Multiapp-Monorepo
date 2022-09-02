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
import { PrometheusMailer } from "../../../email";

describe("Mutations - requestInvite", () => {
  const query = gql`
    mutation RequestInvite($email: String!) {
      requestInvite(email: $email)
    }
  `;

  let server: ApolloServer;
  let stub: User.Stub | null;
  let user: User.Mongo;
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

  it("fails with user's email", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        email: user?.email,
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });

  it("succeeds with stub user's email", async () => {
    const spy = jest
      .spyOn(PrometheusMailer, "sendInviteCode")
      .mockResolvedValueOnce(true);

    const res = await server.executeOperation({
      query,
      variables: {
        email: stub?.email,
      },
    });

    expect(res.data).toHaveProperty("requestInvite");
    expect(res.data?.requestInvite).toBeTruthy();

    spy.mockRestore();
  });

  it("succeeds with new email", async () => {
    const spy = jest
      .spyOn(PrometheusMailer, "sendInviteCode")
      .mockResolvedValueOnce(true);

    const res = await server.executeOperation({
      query,
      variables: {
        email,
      },
    });

    expect(res.data).toHaveProperty("requestInvite");
    expect(res.data?.requestInvite).toBeTruthy();

    spy.mockRestore();
  });
});
