import React, {
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  createContext,
  FC,
} from 'react';
import retry from 'async-retry';
import { StyleSheet, AppState } from 'react-native';
import { StreamChat } from 'stream-chat';

import type { Client, StreamType } from 'mobile/src/services/chat';
import { readToken } from 'mobile/src/services/PushNotificationService';
import { useAccountContext, Account } from 'shared/context/Account';

import { GETSTREAM_ACCESS_KEY } from 'react-native-dotenv';

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
        console.log('Received messaging event', event.type, event);
        if (event.total_unread_count && unreadCount !== event.total_unread_count) {
          console.log('updating unread count');
          setUnreadCount(event.total_unread_count);
        } else if (
          event.type === 'notification.mark_read' &&
          !event.total_unread_count
        ) {
          setUnreadCount(0);
        }
      });

      return () => handler.unsubscribe();
    }
  }, [client]);

  console.log('Unread count', unreadCount);
  return unreadCount;
}

let chatClient: Client | undefined;

interface ChatProviderProps extends PropsWithChildren<unknown> {
  token?: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
  token,
  children,
}) => {
  const user = useAccountContext();
  const [isReady, setReady] = useState<boolean>();
  const [unreadCount, setUnreadCount] = useState(0);

  const connectClient = async (): Promise<void> => {
    if (!chatClient && token) {
      const initialUnreadCount = await connect(user, token);
      if (initialUnreadCount !== null) {
        setUnreadCount(initialUnreadCount);
      }

      setReady(!!chatClient);
    } else if (!isReady) {
      setReady(true);
    }
  };

  if (AppState.currentState !== 'background') {
    console.log('Establishing connection to getstream client');
    connectClient();
  }

  const disconnectClient = async (): Promise<void> => {
    await disconnect();
    setReady(false);
  };

  useEffect(() => {
    const result = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        disconnectClient();
      } else if (state === 'active' && token) {
        connectClient();
      }
    });

    return () => result.remove();
  }, [user, token]);

  const reconnect = (): void => {
    if (token) {
      connect(user, token);
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
      }>
      {children}
    </ChatContext.Provider>
  );
};

const connect = async (
  user: Account,
  token: string,
): Promise<number | null> => {
  if (chatClient) {
    console.log('Chat client already connected');
    return null;
  }

  const client = StreamChat.getInstance<StreamType>(GETSTREAM_ACCESS_KEY);
  try {
    console.log('Connecting to chat client');
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
          token,
        );
      },
      {
        retries: 5,
        onRetry: (err) => {
          console.log('Error connecting', err);
          console.log('Retrying chat connection...');
        },
      },
    );

    chatClient = client;

    const fcmToken = await readToken();
    if (fcmToken) {
      console.log('adding token', fcmToken.token, 'to user', user._id);
      await client.addDevice(fcmToken.token, 'firebase');
    }
    
    return result && result.me ? result.me.total_unread_count : 0;
  } catch (err) {
    console.log('Error connect to stream chat', err);
    return null;
  }
};

const disconnect = async (): Promise<void> => {
  await chatClient?.disconnectUser();
  chatClient = undefined;
  console.log('Stopped chat');
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Chat: Selected User Context Start //

interface ViewProps {
  check: boolean;
  select: Dispatch<SetStateAction<boolean>>;
  remove: Dispatch<SetStateAction<boolean>>;
}

const CheckContext = createContext<ViewProps | null>(null);

const CheckProvider: FC<{ children: any }> = ({ children }) => {
  const [check, setCheck] = useState<boolean>(false);

  const select = () => {
    setCheck(true);
  };

  const remove = () => {
    setCheck(false);
  };

  return (
    <CheckContext.Provider
      value={{
        check: check,
        select: select,
        remove: remove,
      }}>
      {children}
    </CheckContext.Provider>
  );
};

export const useCheck = (): ViewProps => {
  const context = useContext(CheckContext);
  if (!context) {
    throw new Error('Missing Check Context!');
  }

  const { check, select, remove } = context;
  return { check, select, remove };
};

export { CheckProvider };

// Chat: Selected User Context End //
