import React from "react";
import { LiteralStringForUnion } from "stream-chat";

export type AttachmentType = {
  fize_size?: number | string | undefined;
};
export type ChannelType = {};
export type CommandType = LiteralStringForUnion;
export type EventType = {};
export type MessageType = {
  errorStatusCode: number;
};
export type ReactionType = {};
export type UserType = {
  image?: string;
};

export type StreamType = {
  attachmentType: AttachmentType;
  channelType: ChannelType;
  commandType: CommandType;
  eventType: EventType;
  messageType: MessageType;
  reactionType: ReactionType;
  userType: UserType;
};

export const GiphyContext = React.createContext(
  {} as {
    giphyState: boolean;
    setGiphyState: React.Dispatch<React.SetStateAction<boolean>>;
  }
);
