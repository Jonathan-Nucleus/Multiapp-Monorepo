import React from "react";
import { LiteralStringForUnion } from "stream-chat";

export type AttachmentType = {};
export type ChannelType = {};
export type CommandType = LiteralStringForUnion;
export type EventType = {};
export type MessageType = {};
export type ReactionType = {};
export type UserType = {};

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
