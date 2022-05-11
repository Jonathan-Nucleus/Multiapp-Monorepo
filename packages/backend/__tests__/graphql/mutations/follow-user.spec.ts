import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import * as FirebaseModule from "../../../lib/firebase-helper";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import { createUser, getErrorCode, getFieldError } from "../../config/utils";
import { getIgniteDb } from "../../../db";
import { toObjectId } from "../../../lib/mongo-helper";

jest.mock("firebase-admin");

describe("Mutations - followUser", () => {
  const query = gql`
    mutation FollowUser($follow: Boolean!, $userId: ID!) {
      followUser(follow: $follow, userId: $userId)
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let user: User.Mongo;

  beforeAll(async () => {
    authUser = await createUser();
    user = await createUser();
    server = createTestApolloServer(authUser);
  });

  it("fails with invalid user id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        follow: true,
        userId: "test",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "userId")).toBeDefined();
  });

  it("fails to follow the same user", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        follow: true,
        userId: authUser._id.toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });

  it("fails with wrong user id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        follow: true,
        userId: toObjectId().toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("succeeds to follow a user", async () => {
    const spy = jest
      .spyOn(FirebaseModule, "sendPushNotification")
      .mockResolvedValueOnce(undefined);

    const res = await server.executeOperation({
      query,
      variables: {
        follow: true,
        userId: user._id.toString(),
      },
    });

    expect(res.data?.followUser).toBeTruthy();

    const { users } = await getIgniteDb();

    const [newUser1, newUser2] = (await users.findAll([
      toObjectId(authUser._id),
      toObjectId(user._id),
    ])) as User.Mongo[];
    expect(_.map(newUser1.followingIds, (item) => item.toString())).toContain(
      user._id.toString()
    );
    expect(_.map(newUser2.followerIds, (item) => item.toString())).toContain(
      authUser._id.toString()
    );

    spy.mockRestore();
  });

  it("succeeds to unfollow a user", async () => {
    const spy = jest
      .spyOn(FirebaseModule, "sendPushNotification")
      .mockResolvedValueOnce(undefined);

    const { users } = await getIgniteDb();

    const res = await server.executeOperation({
      query,
      variables: {
        follow: false,
        userId: user._id.toString(),
      },
    });

    expect(res.data?.followUser).toBeTruthy();

    const [newUser1, newUser2] = (await users.findAll([
      toObjectId(authUser._id),
      toObjectId(user._id),
    ])) as User.Mongo[];
    expect(
      _.map(newUser1.followingIds, (item) => item.toString())
    ).not.toContain(user._id.toString());
    expect(
      _.map(newUser2.followerIds, (item) => item.toString())
    ).not.toContain(authUser._id.toString());

    spy.mockRestore();
  });
});
