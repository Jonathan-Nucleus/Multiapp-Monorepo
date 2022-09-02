import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server-express";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
import { User } from "../../../schemas/user";
import { createUser, getErrorCode, getFieldError } from "../../config/utils";
import { getIgniteDb } from "../../../db";

describe("Mutations - updateFcmToken", () => {
  const query = gql`
    mutation UpdateFcmToken($fcmToken: String!) {
      updateFcmToken(fcmToken: $fcmToken)
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;

  beforeAll(async () => {
    authUser = await createUser();
    server = createTestApolloServer(authUser);
  });

  it("fails with empty email", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        fcmToken: "",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "fcmToken")).toBeDefined();
  });

  it("succeeds with new fcm token", async () => {
    const newToken = faker.datatype.uuid();

    const res = await server.executeOperation({
      query,
      variables: {
        fcmToken: newToken,
      },
    });

    expect(res.data?.updateFcmToken).toBeTruthy();

    const { users } = await getIgniteDb();
    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;

    expect(newUser.fcmToken).toBe(newToken);
    expect(newUser.fcmTokenCreated).toBeDefined();
  });
});
