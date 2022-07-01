import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server";
import { getIgniteDb } from "../../../db";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
import { User } from "../../../schemas/user";
import {
  createStub,
  createUser,
  DbCollection,
  getErrorCode,
  getFieldError,
} from "../../config/utils";

describe("Mutations - register", () => {
  const query = gql`
    mutation Register($user: UserInput!) {
      register(user: $user)
    }
  `;

  let server: ApolloServer;
  let stub: User.Stub;
  let stub2: User.Stub;
  let user: User.Mongo;
  const userData = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    inviteCode: faker.datatype.uuid(),
    password: "test-pass",
  };

  beforeAll(async () => {
    server = createTestApolloServer();
    stub = await createStub();
    stub2 = await createStub();
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
        user: {
          ...userData,
          email: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "user.email")).toBeDefined();
  });

  it("fails with invalid email", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        user: {
          ...userData,
          email: "test",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "user.email")).toBeDefined();
  });

  it("fails with empty first name", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        user: {
          ...userData,
          firstName: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "user.firstName")).toBeDefined();
  });

  it("fails with empty last name", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        user: {
          ...userData,
          lastName: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "user.lastName")).toBeDefined();
  });

  it("fails with empty invite code", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        user: {
          ...userData,
          inviteCode: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "user.inviteCode")).toBeDefined();
  });

  it("fails with non-invited user", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        user: {
          ...userData,
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("fails with registered user email", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        user: {
          ...userData,
          email: user?.email,
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });

  it("fails with invalid invite code", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        user: {
          ...userData,
          email: stub?.email,
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "user.inviteCode")).toBeDefined();
  });

  it("returns access token", async () => {
    const { db } = await getIgniteDb();
    const oldCount = await db.collection(DbCollection.USERS).countDocuments();

    const res = await server.executeOperation({
      query,
      variables: {
        user: {
          ...userData,
          email: stub?.email,
          inviteCode: stub?.emailToken,
        },
      },
    });

    expect(res.data).toHaveProperty("register");
    expect(res.data?.register?.length).toBeGreaterThan(0);

    const newCount = await db.collection(DbCollection.USERS).countDocuments();
    expect(newCount).toBe(oldCount);
  });

  it("stores lowercase email in user record", async () => {
    const { db } = await getIgniteDb();
    const oldCount = await db.collection(DbCollection.USERS).countDocuments();

    const res = await server.executeOperation({
      query,
      variables: {
        user: {
          ...userData,
          email: stub2?.email.toUpperCase(),
          inviteCode: stub2?.emailToken,
        },
      },
    });

    expect(res.data).toHaveProperty("register");
    expect(res.data?.register?.length).toBeGreaterThan(0);

    const newCount = await db.collection(DbCollection.USERS).countDocuments();
    expect(newCount).toBe(oldCount);

    const newUser = await db
      .collection(DbCollection.USERS)
      .findOne({ email: stub?.email.toLowerCase() });
    expect(newUser).toBeDefined();
  });
});
