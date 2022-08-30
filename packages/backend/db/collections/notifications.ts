/**
 * Notifications collection that serves as the model layer to store and retreive
 * notifications from a MongoDB database.
 */

import _ from "lodash";
import { Collection, ObjectId } from "mongodb";
import { sendPushNotification } from "../../lib/firebase-helper";
import { MongoId, toObjectId, toObjectIds } from "../../lib/mongo-helper";
import { InternalServerError, NotFoundError } from "../../lib/apollo/validate";
import {
  generateNotification,
  Notification,
  NotificationOptionalData,
  NotificationType,
} from "../../schemas/notification";
import { User } from "../../schemas/user";
import _compact from "lodash/compact";

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
const createNotificationsCollection = (
  notificationsCollection: Collection<Notification.Mongo>,
  usersCollection: Collection<User.Mongo | User.Stub>
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
      userIds: MongoId[],
      data?: NotificationOptionalData
    ): Promise<boolean> => {
      const users = (await usersCollection
        .find({
          _id: { $in: toObjectIds(userIds) },
          deletedAt: { $exists: false },
          role: { $ne: "stub" },
        })
        .toArray()) as User.Mongo[];
      if (users.length === 0) {
        console.log(`No users were sent ${type} notification`);
        return false;
      }

      const notificationsData = _compact(
        users.map((user) => {
          if (
            data?.postId &&
            _.map(user.mutedPostIds, (item) => item.toString()).includes(
              data.postId.toString()
            )
          ) {
            return null;
          }

          const { title, body } = generateNotification(type, currentUser);
          return {
            user: user,
            notification: {
              _id: new ObjectId(),
              type,
              userId: user._id,
              title,
              body,
              isNew: true,
              isRead: false,
              data: {
                ...data,
                userId: currentUser._id,
              },
            },
          };
        })
      );

      const notifications = notificationsData.map(
        (notification) => notification.notification
      );
      const notificationUsers = notificationsData.map(
        (notification) => notification.user._id
      );

      await notificationsCollection.insertMany(notifications);
      await usersCollection.updateMany(
        { _id: { $in: notificationUsers } },
        {
          $inc: { notificationBadge: 1 },
          $set: { updatedAt: new Date() },
        }
      );

      await Promise.all(
        notificationsData.map((notificationData) => {
          const { user, notification } = notificationData;
          if (user.fcmToken) {
            sendPushNotification(
              notification.title,
              notification.body,
              user.fcmToken,
              notification.type,
              notification.data
            );
          }
        })
      );

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
      const willSeeNotifications = await notificationsCollection.count({
        userId: toObjectId(userId),
        isNew: true,
        isRead: false,
        ...(notificationId ? { _id: toObjectId(notificationId) } : {}),
      });

      const result = await notificationsCollection.updateMany(
        {
          userId: toObjectId(userId),
          isRead: false,
          ...(notificationId ? { _id: toObjectId(notificationId) } : {}),
        },
        {
          $set: { isNew: false, isRead: true, updatedAt: new Date() },
        }
      );

      if (!result.acknowledged) {
        throw new InternalServerError("Not able to read notification.");
      }

      if (notificationId && !result.matchedCount) {
        throw new NotFoundError("Notification");
      }

      await usersCollection.updateOne(
        {
          _id: toObjectId(userId),
        },
        {
          $inc: { notificationBadge: -willSeeNotifications || 0 },
        }
      );

      return true;
    },

    /**
     * Mark as seen in one/all notification.
     *
     * @param userId            The id of the authenticated user.
     * @param notificationId    The id of the notification.
     *
     * @returns   true
     */
    seen: async (
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

      if (notificationId && !result.matchedCount) {
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
     * @param before        Optional notification id to load items before.
     * @param limit         Optional limit for search result. Defaults to 10.
     * @returns {Notification[]}  An array of Notification object.
     */
    findByFilters: async (
      userId: MongoId,
      before?: string,
      limit = 10
    ): Promise<Notification.Mongo[]> => {
      return notificationsCollection
        .find({
          _id: {
            $lt: toObjectId(before),
          },
          userId: toObjectId(userId),
        })
        .limit(limit)
        .sort({ _id: -1 })
        .toArray();
    },
  };
};

export default createNotificationsCollection;
