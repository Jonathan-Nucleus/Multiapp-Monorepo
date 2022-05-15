import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  PropsWithChildren,
} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StreamChat } from 'stream-chat';

import pStyles from 'mobile/src/theme/pStyles';
import { WHITE } from 'shared/src/colors';

import type { Client, StreamType } from 'mobile/src/services/chat';
import { AccountData } from 'shared/graphql/query/account/useAccount';

import { GETSTREAM_ACCESS_KEY, AVATAR_URL } from 'react-native-dotenv';

export interface ChatSession {
  client: Client;
  userId: string;
}

const ChatContext = React.createContext<ChatSession | undefined>(undefined);
export function useChatContext(): ChatSession {
  const chatSession = useContext(ChatContext);
  if (!chatSession) {
    throw new Error(
      'Chat session context not properly initializeed, Please check to ' +
        'ensure that you have included the approprate Context Provider',
    );
  }

  return chatSession;
}

type Account = AccountData['account'];
interface ChatProviderProps extends PropsWithChildren<unknown> {
  user?: Account;
  token?: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
  user,
  token,
  children,
}) => {
  const chatClient = useRef<Client | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!chatClient.current && user && token) {
      const client = StreamChat.getInstance<StreamType>(GETSTREAM_ACCESS_KEY);
      (async () => {
        try {
          await client.connectUser(
            {
              id: user._id,
              name: `${user.firstName} ${user.lastName}`,
              image: `${AVATAR_URL}/${user.avatar}`,
              company: user.companies?.[0]?.name,
              position: user.position,
            },
            token,
          );

          chatClient.current = client;
          setIsReady(true);
        } catch (err) {
          console.log(err);
        }
      })();

      return () => {
        if (!chatClient.current) return;
        chatClient.current.disconnectUser();
        chatClient.current = null;
        console.log('Stopped chat');
      };
    }
  }, [user, token]);

  if (!chatClient.current || !user || !token) {
    return (
      <View style={[pStyles.globalContainer, styles.container]}>
        <ActivityIndicator size="large" color={WHITE} />
      </View>
    );
  }

  return (
    <ChatContext.Provider
      value={{ client: chatClient.current, userId: user._id }}>
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
