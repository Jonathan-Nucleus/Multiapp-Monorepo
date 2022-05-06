import React, { useContext } from 'react';
import type {
  StreamChat,
  DefaultGenerics,
  Channel as SCChannel,
  ChannelSort as SCChanelSort,
  ChannelFilters as SCChannelFilters,
  MessageResponse as SCMessage,
  UserResponse as SCUser,
} from 'stream-chat';

type UserType = Pick<
  SCUser<DefaultGenerics>,
  'id' | 'name' | 'online' | 'created_at' | 'last_active'
> & {
  image?: string;
};

type MessageType = Pick<
  SCMessage<DefaultGenerics>,
  'id' | 'userId' | 'attachments' | 'parent_id' | 'text' | 'user' | 'created_at'
>;

export interface StreamType extends DefaultGenerics {
  messageType: MessageType;
  userType: UserType;
}

export type User = UserType;
export type Channel = SCChannel<StreamType>;
export type Message = MessageType;
export type ChannelFilters = SCChannelFilters<StreamType>;
export type ChannelSort = SCChanelSort<StreamType>;
export type Client = StreamChat<StreamType>;

export interface ChatSession {
  client: Client;
  userId: string;
}

export const ChatContext = React.createContext<ChatSession | undefined>(
  undefined,
);

export function useChatContext(): ChatSession {
  const chatSession = useContext(ChatContext);
  if (!chatSession) {
    throw new Error(
      'Chat session context not properly initializeed, Please check to ensure that you have included the approprate Context Provider',
    );
  }

  return chatSession;
}

const ChatProvider = ChatContext.Provider;
export default ChatProvider;
