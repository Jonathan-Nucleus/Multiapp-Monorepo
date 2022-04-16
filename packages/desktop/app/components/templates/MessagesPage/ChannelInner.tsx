import React, { useContext } from "react";
import { Attachment, logChatPromiseExecution, UserResponse } from "stream-chat";
import {
  MessageList,
  MessageInput,
  Window,
  StreamMessage,
  useChannelActionContext,
  useChannelStateContext,
} from "stream-chat-react";

import MessagingChannelHeader from "./MessagingChannelHeader";
import MessagingInput from "./MessagingInput";
import Message from "./Message";
import { GiphyContext, StreamType } from "./types";

export type ChannelInnerProps = {
  toggleMobile: () => void;
};

export const ChannelInner: React.FC<ChannelInnerProps> = (props) => {
  const { toggleMobile } = props;
  const { giphyState, setGiphyState } = useContext(GiphyContext);

  const { channel } = useChannelStateContext<StreamType>();
  const { sendMessage } = useChannelActionContext<StreamType>();

  const overrideSubmitHandler = (message: {
    attachments: Attachment[];
    mentioned_users: UserResponse[];
    text: string;
    parent?: StreamMessage;
  }) => {
    let updatedMessage;

    if (message.attachments?.length && message.text?.startsWith("/giphy")) {
      const updatedText = message.text.replace("/giphy", "");
      updatedMessage = { ...message, text: updatedText };
    }

    if (giphyState) {
      const updatedText = `/giphy ${message.text}`;
      updatedMessage = { ...message, text: updatedText };
    }

    if (sendMessage) {
      const newMessage = updatedMessage || message;
      const parentMessage = newMessage.parent;

      const messageToSend = {
        ...newMessage,
        parent: parentMessage
          ? {
              ...parentMessage,
              created_at: parentMessage.created_at?.toString(),
              pinned_at: parentMessage.pinned_at?.toString(),
              updated_at: parentMessage.updated_at?.toString(),
            }
          : undefined,
      };

      const sendMessagePromise = sendMessage(messageToSend);
      logChatPromiseExecution(sendMessagePromise, "send message");
    }

    setGiphyState(false);
  };

  const actions = ["delete", "edit", "flag", "mute", "react", "reply"];
  return (
    <Window>
      <MessagingChannelHeader toggleMobile={toggleMobile} />
      <MessageList messageActions={actions} Message={Message} />
      <MessageInput
        Input={MessagingInput}
        overrideSubmitHandler={overrideSubmitHandler}
        focus
      />
    </Window>
  );
};
