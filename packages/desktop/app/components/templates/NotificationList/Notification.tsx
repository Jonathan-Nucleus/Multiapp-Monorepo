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

import Avatar from "shared/assets/images/apple.svg";

interface Notification {
  name: string;
  image: string;
  id: string;
  unread: boolean;
  mentioned?: boolean;
  commented?: boolean;
  liked?: boolean;
  message?: boolean;
  following?: boolean;
  shared?: boolean;
  lastMessage?: string;
  createdAt: Date;
}
interface Props {
  notification: Notification;
}

const Notification: FC<Props> = ({ notification }: Props) => {
  const title = (val: Notification) => {
    if (val.commented) {
      return `${val.name} commented on your post`;
    }
    if (val.liked) {
      return `${val.name} liked your post`;
    }
    if (val.message) {
      return `${val.name} sent you a message`;
    }
    if (val.following) {
      return `${val.name} is following you`;
    }
    if (val.mentioned) {
      return `${val.name} mentioned you in a comment`;
    }
    if (val.shared) {
      return `${val.name} shared your post`;
    }
    return `${val.name} sent you a message`;
  };

  const renderIcon = (val: Notification) => {
    if (val.commented) {
      return <ChatCenteredText size={18} />;
    }
    if (val.liked) {
      return <ThumbsUp size={18} />;
    }
    if (val.message) {
      return <Chats size={18} />;
    }
    if (val.following) {
      return <UserCirclePlus size={18} />;
    }
    if (val.mentioned) {
      return <At size={18} />;
    }
    if (val.shared) {
      return <Share size={18} />;
    }
    return <Chats size={18} />;
  };

  return (
    <div
      className={`flex justify-between items-center p-4 ${
        notification.unread && "bg-background-blue"
      } `}
      key={notification.id}
    >
      <div className="flex items-center  w-9/12">
        <div className="relative">
          <Image src={Avatar} width={48} height={48} alt="" layout="fixed" />
          <div className="absolute bottom-0 right-0 rounded-full bg-purple-secondary p-1">
            {renderIcon(notification)}
          </div>
        </div>
        <div className="ml-3 max-w-full grid">
          <div className={notification.unread ? "font-bold" : "font-normal"}>
            {title(notification)}
          </div>
          <div className="truncate text-white opacity-60">
            {notification.lastMessage}
          </div>
        </div>
      </div>
      <div className="text-sm text-white opacity-60 w-100 text-right">
        {moment(notification.createdAt).fromNow()}
      </div>
    </div>
  );
};

export default Notification;
