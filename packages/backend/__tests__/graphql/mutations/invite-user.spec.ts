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
import { getIgniteDb } from "../../../db";

describe("Mutations - inviteUser", () => {
  const query = gql`
    mutation Invite($email: String!) {
      inviteUser(email: $email)
    }
  `;

  let server: ApolloServer;
  let stub: User.Stub | null;
  let authUser: User.Mongo;
  let user: User.Mongo;
  const email = faker.internet.email();

  beforeAll(async () => {
    stub = await createStub();
    authUser = await createUser();
    user = await createUser();
    server = createTestApolloServer(authUser);
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

  it("fails with registered user's email", async () => {
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

    const { users } = await getIgniteDb();
    const oldUser = (await users.find({ _id: authUser._id })) as User.Mongo;

    const res = await server.executeOperation({
      query,
      variables: {
        email: stub?.email,
      },
    });

    expect(res.data).toHaveProperty("inviteUser");
    expect(res.data?.inviteUser).toBeTruthy();

    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;

    expect(newUser.inviteeIds?.length).toBe(
      (oldUser.inviteeIds?.length || 0) + 1
    );

    spy.mockRestore();
  });

  it("succeeds with new email", async () => {
    const spy = jest
      .spyOn(PrometheusMailer, "sendInviteCode")
      .mockResolvedValueOnce(true);

    const { users } = await getIgniteDb();
    const oldUser = (await users.find({ _id: authUser._id })) as User.Mongo;

    const res = await server.executeOperation({
      query,
      variables: {
        email,
      },
    });

    expect(res.data).toHaveProperty("inviteUser");
    expect(res.data?.inviteUser).toBeTruthy();

    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;

    expect(newUser.inviteeIds?.length).toBe(
      (oldUser.inviteeIds?.length || 0) + 1
    );

    spy.mockRestore();
  });
});
