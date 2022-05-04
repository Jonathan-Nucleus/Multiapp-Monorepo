import React, { useContext } from "react";
import { logChatPromiseExecution } from "stream-chat";
import {
  MessageList,
  MessageInput,
  MessageInputProps,
  Window,
  useChannelActionContext,
} from "stream-chat-react";

import PChannelHeader from "./PChannelHeader";
import PMessageList from "./PMessageList";
import PMessagingInput from "./PMessageInput";
import { GiphyContext, StreamType } from "../types";

export type PChannelProps = {
  toggleMobile: () => void;
};

export const PChannel: React.FC<PChannelProps> = (props) => {
  const { toggleMobile } = props;
  const { giphyState, setGiphyState } = useContext(GiphyContext);
  const { sendMessage } = useChannelActionContext<StreamType>();

  const overrideSubmitHandler: MessageInputProps["overrideSubmitHandler"] = (
    message
  ) => {
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
      <PChannelHeader toggleMobile={toggleMobile} />
      <PMessageList />
      <MessageInput
        Input={PMessagingInput}
        overrideSubmitHandler={overrideSubmitHandler}
        focus
      />
    </Window>
  );
};
