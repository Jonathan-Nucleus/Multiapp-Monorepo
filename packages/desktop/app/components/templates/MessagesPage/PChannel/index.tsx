import React, { useContext } from "react";
import { logChatPromiseExecution } from "stream-chat";
import {
  MessageList,
  MessageInput,
  MessageInputProps,
  MessageToSend,
  Window,
  useChannelActionContext,
} from "stream-chat-react";
import dayjs from "dayjs";

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

  const overrideSubmitHandler: MessageInputProps<StreamType>["overrideSubmitHandler"] =
    (message) => {
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
        const messageToSend: MessageToSend<StreamType> = {
          ...newMessage,
          parent: newMessage.parent,
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
