import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import { createTestApolloServer } from "../../../lib/server";
import { User } from "../../../schemas/user";
import { Notification } from "../../../schemas/notification";
import { createNotification, createUser } from "../../config/utils";
import { getIgniteDb } from "../../../db";

describe("Query - notifications", () => {
  const query = gql`
    query Notifications {
      notifications {
        _id
        type
        title
        body
        isNew
        user {
          _id
          firstName
          lastName
        }
      }
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
      createNotification(user1._id, authUser._id, false),
      createNotification(user1._id, authUser._id, true, "like-post"),
    ])) as Notification.Mongo[];

    server = createTestApolloServer(authUser);
  });

  it("succeeds to get all notifications", async () => {
    const res = await server.executeOperation({
      query,
    });

    expect(res.data?.notifications).toHaveLength(3);
    const ids = _.map(res.data?.notifications, "_id");
    expect(ids).toContain(notifications[0]._id.toString());
    expect(ids).toContain(notifications[1]._id.toString());
    expect(ids).toContain(notifications[2]._id.toString());

    expect(res.data?.notifications[0].user._id).toBe(authUser._id.toString());

    const { users } = await getIgniteDb();
    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;
    expect(newUser.notificationBadge).toBe(2);
  });
});
