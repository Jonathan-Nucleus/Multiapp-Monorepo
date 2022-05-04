/**
 * Notifications collection that serves as the model layer to store and retreive
 * notifications from a MongoDB database.
 */

import _ from "lodash";
import { Collection, ObjectId } from "mongodb";
import { sendPushNotification } from "../../lib/firebase-helper";
import { MongoId, toObjectId } from "../../lib/mongo-helper";
import { InternalServerError, NotFoundError } from "../../lib/validate";
import {
  generateNotification,
  Notification,
  NotificationOptionalData,
  NotificationType,
} from "../../schemas/notification";
import { isUser, User } from "../../schemas/user";

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
const createNotificationsCollection = (
  notificationsCollection: Collection<Notification.Mongo>,
  usersCollection: Collection<User.Mongo>
) => {
  return {
    /**
     * Find a notification by the id.
     *
     * @param id  The id of the notification.
     *
     * @returns   The notification or null if it was not found.
     */
    find: async (id: MongoId): Promise<Notification.Mongo | null> =>
      notificationsCollection.findOne({ _id: toObjectId(id) }),

    /**
     * Create a new notification.
     *
     * @param type            The notification type.
     * @param userId          The id of the user who will receive notification.
     * @param data            The notification data.
     *
     * @returns   true
     */
    create: async (
      currentUser: User.Mongo,
      type: NotificationType,
      userId: MongoId,
      data?: NotificationOptionalData
    ): Promise<boolean> => {
      const user = await usersCollection.findOne({
        _id: toObjectId(userId),
        deletedAt: { $exists: false },
      });
      if (!user || !isUser(user)) {
        throw new NotFoundError();
      }

      if (
        data?.postId &&
        _.map(user.mutedPostIds, (item) => item.toString()).includes(
          data.postId.toString()
        )
      ) {
        return true;
      }

      const { title, body } = generateNotification(type, currentUser);
      const notificationData = {
        _id: new ObjectId(),
        type,
        userId: user._id,
        title,
        body,
        isNew: true,
        data: {
          ...data,
          userId: currentUser._id,
        },
      };
      await notificationsCollection.insertOne(notificationData);
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $inc: { notificationBadge: 1 },
          $set: { updatedAt: new Date() },
        }
      );

      if (user.fcmToken) {
        sendPushNotification(title, body, user.fcmToken);
      }

      return true;
    },

    /**
     * Mark as read in one/all notification.
     *
     * @param userId            The id of the authenticated user.
     * @param notificationId    The id of the notification.
     *
     * @returns   true
     */
    read: async (
      userId: MongoId,
      notificationId?: MongoId
    ): Promise<boolean> => {
      const result = await notificationsCollection.updateMany(
        {
          userId: toObjectId(userId),
          isNew: true,
          ...(notificationId ? { _id: toObjectId(notificationId) } : {}),
        },
        {
          $set: { isNew: false, updatedAt: new Date() },
        }
      );

      if (!result.acknowledged) {
        throw new InternalServerError("Not able to read notification.");
      }

      if (!result.matchedCount) {
        throw new NotFoundError("Notification");
      }

      await usersCollection.updateOne(
        {
          _id: toObjectId(userId),
        },
        {
          $inc: { notificationBadge: -result.modifiedCount || 0 },
        }
      );

      return true;
    },

    /**
     * Provides a list of notifications by user
     *
     * @param userId        The authenticated user id
     *
     * @returns {Notification[]}  An array of Notification object.
     */
    findAllByUser: async (userId: MongoId): Promise<Notification.Mongo[]> => {
      return notificationsCollection
        .find({
          userId: toObjectId(userId),
        })
        .toArray();
    },
  };
};

export default createNotificationsCollection;
