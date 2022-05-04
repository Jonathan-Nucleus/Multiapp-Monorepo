import React, { ReactElement, useRef, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { StreamChat, Channel as SCChannel } from 'stream-chat';

import pStyles from 'mobile/src/theme/pStyles';
import { WHITE } from 'shared/src/colors';

import ChatProvider from 'mobile/src/context/Chat';
import { useAccount } from 'mobile/src/graphql/query/account';
import { useChatToken } from 'mobile/src/graphql/query/account/useChatToken';

import ChannelList from 'mobile/src/screens/Main/Chat/ChannelList';
import Channel from 'mobile/src/screens/Main/Chat/Channel';

import type { MainTabScreenProps } from './MainTabNavigator';
import { GETSTREAM_ACCESS_KEY, AVATAR_URL } from 'react-native-dotenv';

const Stack = createStackNavigator();
const ChatStack = () => {
  const { data: accountData } = useAccount({ fetchPolicy: 'cache-only' });
  const { data, loading: loadingToken, called: calledToken } = useChatToken();
  const chatClient = useRef<StreamChat | null>(null);
  const [isReady, setIsReady] = useState(false);

  const account = accountData?.account;
  const token = data?.chatToken;

  useEffect(() => {
    if (!chatClient.current && account && token) {
      const client = StreamChat.getInstance(GETSTREAM_ACCESS_KEY);
      (async () => {
        await client.connectUser(
          {
            id: account._id,
            name: `${account.firstName} ${account.lastName}`,
            image: `${AVATAR_URL}/${account.avatar}`,
          },
          token,
        );

        console.log('Started chat');

        chatClient.current = client;
        setIsReady(true);
      })();

      return () => {
        if (!chatClient.current) return;
        chatClient.current.disconnectUser();
        console.log('Stopped chat');
      };
    }
  }, [account, token]);

  if (calledToken && !loadingToken && !token) {
    console.log('Error fetching chat token');
  }

  return !chatClient.current || !account ? (
    <View style={[pStyles.globalContainer, styles.container]}>
      <ActivityIndicator size="large" color={WHITE} />
    </View>
  ) : (
    <ChatProvider value={{ client: chatClient.current, userId: account._id }}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, gestureEnabled: true }}
        initialRouteName="ChannelList">
        <Stack.Screen name="ChannelList" component={ChannelList} />
        <Stack.Screen name="Channel" component={Channel} />
      </Stack.Navigator>
    </ChatProvider>
  );
};

export default ChatStack;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export type ChatStackParamList = {
  ChannelList: undefined;
  Channel: {
    channelId: string;
    initialData?: SCChannel;
  };
};

export type ChatScreenProps<
  RouteName extends keyof ChatStackParamList = keyof ChatStackParamList,
> = CompositeScreenProps<
  StackScreenProps<ChatStackParamList, RouteName>,
  MainTabScreenProps
>;

export type ChannelListScreen = (
  props: ChatScreenProps<'ChannelList'>,
) => ReactElement | null;

export type ChannelScreen = (
  props: ChatScreenProps<'Channel'>,
) => ReactElement | null;
