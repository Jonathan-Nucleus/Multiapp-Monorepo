import React, { FC } from "react";
import { useRouter } from "next/router";
import { ChatCenteredText, ThumbsUp, UserCirclePlus, At } from "phosphor-react";
import moment from "moment";

import { Notification } from "backend/graphql/notifications.graphql";
import Avatar from "../../../common/Avatar";

interface NotificationItemProps {
  notification: Notification;
  handleReadNotification: (id: string) => Promise<void>;
}

const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  handleReadNotification,
}) => {
  const router = useRouter();

  let notificationIcon;
  switch (notification.type) {
    case "COMMENT_POST":
      notificationIcon = <ChatCenteredText size={16} />;
      break;
    case "LIKE_POST":
      notificationIcon = <ThumbsUp size={16} />;
      break;
    case "TAGGED_IN_POST":
    case "TAGGED_IN_COMMENT":
      notificationIcon = <At size={16} />;
      break;
    case "FOLLOWED_BY_USER":
    case "FOLLOWED_BY_COMPANY":
      notificationIcon = <UserCirclePlus size={16} />;
      break;
  }

  return (
    <div
      className={`${notification.isNew && "bg-background-blue"}`}
      onClick={async () => {
        if (notification.isNew) {
          await handleReadNotification(notification._id);
        }

        if (notification.type === "FOLLOWED_BY_USER") {
          router.push(`profile/${notification.data.userId}`);
        } else {
          router.push(`posts/${notification.data.postId}`);
        }
      }}
    >
      <div className="flex items-center cursor-pointer py-3">
        <div className={notification.isNew ? "" : "invisible"}>
          <div className="w-2 h-2 rounded-full bg-yellow ml-2" />
        </div>
        <div className="relative ml-2">
          <Avatar user={notification.data.user} size={48} />
          <div className="absolute -bottom-1 -right-1 rounded-full bg-purple-secondary p-1">
            {notificationIcon}
          </div>
        </div>
        <div className="text-sm flex-grow ml-3 text-white">
          <div
            className={
              notification.isNew
                ? "font-semibold"
                : "font-light text-white/[0.8]"
            }
          >
            {notification.body}
          </div>
        </div>
        <div className="text-xs text-white/[0.4] font-light flex-shrink-0 ml-3 mr-6">
          {moment(notification.createdAt).fromNow()}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
