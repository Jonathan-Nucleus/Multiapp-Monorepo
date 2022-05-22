import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  PropsWithChildren,
} from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { StreamChat } from 'stream-chat';

import pStyles from 'mobile/src/theme/pStyles';

import type { Client, StreamType } from 'mobile/src/services/chat';
import { useAccountContext } from 'mobile/src/context/Account';

import { GETSTREAM_ACCESS_KEY, AVATAR_URL } from 'react-native-dotenv';

export interface ChatSession {
  client: Client;
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

  useEffect(() => {
    if (!chatClient.current && !fetchingClient.current) {
      const client = StreamChat.getInstance<StreamType>(GETSTREAM_ACCESS_KEY);
      (async () => {
        try {
          fetchingClient.current = true;
          await client.connectUser(
            {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
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
          console.log(err);
          setReady(false);
        }

        fetchingClient.current = false;

        if (!chatClient.current && retryCount.current < 3) {
          retryCount.current++;
          setReady(undefined);
          console.log('Retrying');
        }
      })();

      return () => {
        chatClient.current?.disconnectUser();
        chatClient.current = undefined;
        console.log('Stopped chat');
      };
    }
  }, [user, token]);

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
          ? { client: chatClient.current, userId: user._id }
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
