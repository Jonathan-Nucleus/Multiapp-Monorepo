import { Collection } from "mongodb";
import createAppNotificationsCollection from "backend/db/collections/notifications";
import { Notification } from "../../schemas/notification";
import { User } from "../../schemas/user";

const createAdminNotificationsCollection = (
  notificationsCollection: Collection<Notification.Mongo>,
  usersCollection: Collection<User.Mongo | User.Stub>
) => {
  return {
    ...createAppNotificationsCollection(
      notificationsCollection,
      usersCollection
    ),
  };
};

export default createAdminNotificationsCollection;
