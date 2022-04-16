import React, { useRef } from "react";
import { Avatar, useMessageContext, useChatContext } from "stream-chat-react";
import dayjs from "dayjs";

import styles from "./message.module.scss";

export const Message = () => {
  const { message } = useMessageContext();
  const { client } = useChatContext();

  const isFromMe = client.userID === message.user.id;
  //const hasAttachments = !!message.attachments;

  return (
    <div className={`flex content mb-4 ${isFromMe ? "justify-end" : ""}`}>
      <div className="flex h-10 items-center">
        {!isFromMe && (
          <Avatar image={message.user?.image} name={message.user?.name} />
        )}
      </div>
      <div>
        <p
          className={`text-sm px-4 py-2 rounded-lg text-white ${
            isFromMe ? "bg-primary" : "bg-gray-800"
          }`}
        >
          {message.text}
        </p>
        <span
          className={`text-xs mt-2 block text-white text-opacity-40 ${
            isFromMe ? "text-right" : ""
          }`}
        >
          {dayjs(message.created_at).format("h:mm A")}
        </span>
      </div>
    </div>
  );
};

export default Message;
