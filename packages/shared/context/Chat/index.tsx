import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  PropsWithChildren,
} from "react";
import { StreamChat } from "stream-chat";

import type { Client, StreamType } from "./types";
import { useAccountContext } from "shared/context/Account";

export interface ChatSession {
  client: Client;
  reconnect: () => void;
  userId: string;
  unreadCount: number;
}

const ChatContext = React.createContext<ChatSession | undefined>(undefined);
export function useChatContext(): ChatSession | undefined {
  return useContext(ChatContext);
}

export function useUnreadCount(): number {
  const { client, unreadCount: userUnreadCount } = useChatContext() || {};
  const [unreadCount, setUnreadCount] = useState(userUnreadCount ?? 0);

  useEffect(() => {
    if (client) {
      setUnreadCount(userUnreadCount ?? 0);
      const handler = client.on((event) => {
        // DEBUG: console.log("Received messaging event", event.type, event);
        if (
          event.total_unread_count &&
          unreadCount !== event.total_unread_count
        ) {
          setUnreadCount(event.total_unread_count);
        } else if (
          event.type === "notification.mark_read" &&
          !event.total_unread_count
        ) {
          setUnreadCount(0);
        }
      });

      return () => handler.unsubscribe();
    }
  }, [client]);

  return unreadCount;
}

interface ChatProviderProps extends PropsWithChildren<unknown> {
  token?: string;
  apiKey: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
  token,
  apiKey,
  children,
}) => {
  const user = useAccountContext();
  const chatClient = useRef<Client>();
  const fetchingClient = useRef(false);
  const [isReady, setReady] = useState<boolean>();
  const [unreadCount, setUnreadCount] = useState(0);
  const retryCount = useRef(0);

  const connect = useCallback(async (): Promise<void> => {
    if (!token || !user) {
      console.log("Invalid user or token");
      return;
    }

    if (chatClient.current) {
      await chatClient.current.disconnectUser();
    }

    const client = StreamChat.getInstance<StreamType>(apiKey);
    try {
      fetchingClient.current = true;
      console.log("Connecting to stream chat client");
      const result = await client.connectUser(
        {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.avatar,
          company: user.companies?.[0]?.name,
          position: user.position,
        },
        token
      );
      chatClient.current = client;
      if (result && result.me) {
        setUnreadCount(result.me.total_unread_count);
      }

      setReady(true);
    } catch (err) {
      console.log("Error connect to stream chat", err);
      setReady(false);
    }

    fetchingClient.current = false;

    if (!chatClient.current && retryCount.current < 3) {
      retryCount.current++;
      setReady(undefined);
      console.log("Retrying");
      connect();
    }
  }, [user, token]);

  const disconnect = (): void => {
    chatClient.current?.disconnectUser();
    chatClient.current = undefined;
    fetchingClient.current = false;
    retryCount.current = 0;

    setReady(undefined);
    console.log("Stopped chat");
  };

  useEffect(() => {
    if (!chatClient.current && !fetchingClient.current) {
      connect();

      return () => {
        disconnect();
      };
    }
  }, [connect]);

  if (isReady !== undefined && !chatClient) {
    return null;
  }

  return (
    <ChatContext.Provider
      value={
        chatClient.current
          ? {
              client: chatClient.current,
              userId: user._id,
              reconnect: connect,
              unreadCount,
            }
          : undefined
      }
    >
      {children}
    </ChatContext.Provider>
  );
};
