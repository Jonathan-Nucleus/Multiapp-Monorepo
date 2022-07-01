import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { User } from "../../../schemas/user";
import { Notification } from "../../../schemas/notification";
import {
  createNotification,
  createUser,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { getIgniteDb } from "../../../db";
import { toObjectId } from "../../../lib/mongo-helper";
import { ErrorCode } from "../../../lib/apollo/validate";

describe("Mutations - readNotification", () => {
  const query = gql`
    mutation readNotification($notificationId: ID) {
      readNotification(notificationId: $notificationId)
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let user1: User.Mongo;
  let notifications: Notification.Mongo[];

  beforeAll(async () => {
    authUser = await createUser();
    user1 = await createUser();
    notifications = (await Promise.all([
      createNotification(user1._id, authUser._id),
      createNotification(user1._id, authUser._id),
      createNotification(user1._id, authUser._id),
    ])) as Notification.Mongo[];

    server = createTestApolloServer(authUser);
  });

  it("fails with invalid notification id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        notificationId: "test",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "notificationId")).toBeDefined();
  });

  it("fails with wrong notification id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        notificationId: toObjectId().toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("succeeds to read notification", async () => {
    const { users } = await getIgniteDb();
    const oldUser = (await users.find({ _id: authUser._id })) as User.Mongo;

    const res = await server.executeOperation({
      query,
      variables: {
        notificationId: notifications[0]._id.toString(),
      },
    });

    expect(res.data?.readNotification).toBeTruthy();

    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;
    const oldNotificationBadge = (oldUser.notificationBadge || 0) - 1;
    expect(newUser.notificationBadge).toBe(oldNotificationBadge);
  });

  it("fails with past notification id", async () => {
    const { users } = await getIgniteDb();
    const oldUser = (await users.find({ _id: authUser._id })) as User.Mongo;

    const res = await server.executeOperation({
      query,
      variables: {
        notificationId: notifications[0]._id.toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);

    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;
    expect(newUser.notificationBadge).toBe(oldUser.notificationBadge);
  });

  it("succeeds to read all notifications", async () => {
    const { users } = await getIgniteDb();

    const res = await server.executeOperation({
      query,
    });

    expect(res.data?.readNotification).toBeTruthy();

    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;
    expect(newUser.notificationBadge).toBe(0);
  });
});
