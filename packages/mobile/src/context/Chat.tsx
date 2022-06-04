import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  PropsWithChildren,
} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StreamChat } from 'stream-chat';

import pStyles from 'mobile/src/theme/pStyles';

import type { Client, StreamType } from 'mobile/src/services/chat';
import { readToken } from 'mobile/src/services/PushNotificationService';
import { useAccountContext } from 'shared/context/Account';

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
        if (
          event.total_unread_count &&
          unreadCount !== event.total_unread_count
        ) {
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

interface ChatProviderProps extends PropsWithChildren<unknown> {
  token?: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
  token,
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
      console.log('Invalid user or token');
      return;
    }

    if (chatClient.current) {
      await chatClient.current.disconnectUser();
    }

    const client = StreamChat.getInstance<StreamType>(GETSTREAM_ACCESS_KEY);
    try {
      fetchingClient.current = true;
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
        token,
      );
      chatClient.current = client;
      if (result && result.me) {
        setUnreadCount(result.me.total_unread_count);
      }

      const fcmToken = await readToken();
      if (fcmToken) {
        console.log('adding token', fcmToken.token, 'to user', user._id);
        await client.addDevice(fcmToken.token, 'firebase');
      }

      setReady(true);
    } catch (err) {
      console.log('Error connect to stream chat', err);
      setReady(false);
    }

    fetchingClient.current = false;

    if (!chatClient.current && retryCount.current < 3) {
      retryCount.current++;
      setReady(undefined);
      console.log('Retrying');
      connect();
    }
  }, [user, token]);

  const disconnect = (): void => {
    chatClient.current?.disconnectUser();
    chatClient.current = undefined;
    fetchingClient.current = false;
    retryCount.current = 0;

    setReady(undefined);
    console.log('Stopped chat');
  };

  useEffect(() => {
    console.log('');
    if (!chatClient.current && !fetchingClient.current) {
      connect();

      return () => {
        disconnect();
      };
    }
  }, [connect]);

  if (isReady !== undefined && !chatClient) {
    return (
      <View style={[pStyles.globalContainer, styles.container]}>
        <Text>Error connecting to messenger</Text>
      </View>
    );
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
      }>
      {children}
    </ChatContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
