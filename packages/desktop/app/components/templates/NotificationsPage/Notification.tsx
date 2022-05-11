import React, { FC } from "react";
import {
  ChatCenteredText,
  ThumbsUp,
  Chats,
  UserCirclePlus,
  At,
  Share,
} from "phosphor-react";
import Image from "next/image";
import moment from "moment";

import { Notification } from "backend/graphql/notifications.graphql";
import Avatar from "../../common/Avatar";

interface Props {
  notification: Notification;
  handleReadNotification: (id: string) => void;
}

const NotificationDetail: FC<Props> = ({
  notification,
  handleReadNotification,
}) => {
  const renderIcon = (val: Notification) => {
    if (val.type === "comment-post") {
      return <ChatCenteredText size={18} />;
    }
    if (val.type === "like-post") {
      return <ThumbsUp size={18} />;
    }
    if (val.type === "followed-by-user") {
      return <UserCirclePlus size={18} />;
    }
    return <Chats size={18} />;
  };

  return (
    <div
      className={`flex justify-between items-center p-4 cursor-pointer ${
        notification.isNew && "bg-background-blue"
      } `}
      key={notification._id}
      onClick={() =>
        notification.isNew && handleReadNotification(notification._id)
      }
    >
      <div className="flex items-center  w-9/12">
        <div className="relative">
          {notification.isNew && (
            <div className="absolute top-[18px] right-[58px] w-2 h-2 rounded-full bg-yellow"></div>
          )}
          <Avatar user={notification.user} size={48} className="pl-3" />
          <div className="absolute bottom-0 right-0 rounded-full bg-purple-secondary p-1">
            {renderIcon(notification)}
          </div>
        </div>
        <div className="ml-3 max-w-full grid">
          <div className={notification.isNew ? "font-bold" : "font-normal"}>
            {notification.body}
          </div>
        </div>
      </div>
      <div className="text-sm text-white opacity-60 w-100 text-right">
        {moment(notification.createdAt).fromNow()}
      </div>
    </div>
  );
};

export default NotificationDetail;
