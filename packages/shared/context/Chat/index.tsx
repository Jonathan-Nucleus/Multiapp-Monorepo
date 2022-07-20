import { Client, StreamType } from "./types";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Account, useAccountContext } from "../Account";
import { StreamChat } from "stream-chat";
import retry from "async-retry";

export interface ChatSession {
  client: Client;
  reconnect: () => void;
  userId: string;
  unreadCount: number;
}

const ChatContext = createContext<ChatSession | undefined>(undefined);

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

let chatClient: Client | undefined;

interface ChatProviderProps extends PropsWithChildren<unknown> {
  token?: string;
  apiKey: string;
}

export const ChatProvider: FC<ChatProviderProps> = ({
  token,
  apiKey,
  children,
}) => {
  const user = useAccountContext();
  const [isReady, setReady] = useState<boolean>();
  const [unreadCount, setUnreadCount] = useState(0);

  const connectClient = async (): Promise<void> => {
    if (!chatClient && token) {
      const initialUnreadCount = await connect(user, token, apiKey);
      if (initialUnreadCount !== null) {
        setUnreadCount(initialUnreadCount);
      }
      setReady(!!chatClient);
    }
  };

  connectClient();

  if (isReady !== undefined && !chatClient) {
    return null;
  }

  const reconnect = (): void => {
    if (token) {
      connect(user, token, apiKey);
    }
  };

  return (
    <ChatContext.Provider
      value={
        chatClient
          ? {
              client: chatClient,
              userId: user._id,
              reconnect,
              unreadCount,
            }
          : undefined
      }
    >
      {children}
    </ChatContext.Provider>
  );
};

export const connect = async (
  user: Account,
  token: string,
  apiKey: string
): Promise<number | null> => {
  if (chatClient) {
    console.log("Chat client already connected");
    return null;
  }

  const client = StreamChat.getInstance<StreamType>(apiKey);
  try {
    console.log("Connecting to chat client");
    const result = await retry(
      async () => {
        return client.connectUser(
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
      },
      {
        retries: 5,
        onRetry: (err) => {
          console.log("Error connecting", err);
          console.log("Retrying chat connection...");
        },
      }
    );

    chatClient = client;

    return result && result.me ? result.me.total_unread_count : 0;
  } catch (err) {
    console.log("Error connect to stream chat", err);
    return null;
  }
};
