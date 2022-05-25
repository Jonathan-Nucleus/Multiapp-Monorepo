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
import { useAccountContext } from 'mobile/src/context/Account';

import { GETSTREAM_ACCESS_KEY, AVATAR_URL } from 'react-native-dotenv';

export interface ChatSession {
  client: Client;
  reconnect: () => void;
  userId: string;
}

const ChatContext = React.createContext<ChatSession | undefined>(undefined);
export function useChatContext(): ChatSession | undefined {
  return useContext(ChatContext);
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
      await client.connectUser(
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
      console.log('Client created');
      chatClient.current = client;
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
          ? { client: chatClient.current, userId: user._id, reconnect: connect }
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
