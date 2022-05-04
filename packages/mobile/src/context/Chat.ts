import React, { useContext } from 'react';
import type { StreamChat } from 'stream-chat';

interface ChatSession {
  client: StreamChat;
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
