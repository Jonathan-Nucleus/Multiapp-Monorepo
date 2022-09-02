import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';

import { Channel as ChannelType } from 'mobile/src/services/chat';

import ChannelList from 'mobile/src/screens/Main/Chat/ChannelList';
import NewChat from 'mobile/src/screens/Main/Chat/NewChat';
import Channel from 'mobile/src/screens/Main/Chat/Channel';
import ChannelInfo from 'mobile/src/screens/Main/Chat/ChannelInfo';
import ArchivedChats from '../screens/Main/Chat/ArchivedChats';

import type { MainTabScreenProps } from './MainTabNavigator';
import { CheckProvider } from '../context/Chat';

const Stack = createStackNavigator();
const ChatStack = () => {
  return (
    <CheckProvider>
      <Stack.Navigator
        screenOptions={{ headerShown: false, gestureEnabled: true }}
        initialRouteName="ChannelList">
        <Stack.Screen name="ChannelList" component={ChannelList} />
        <Stack.Screen name="NewChat" component={NewChat} />
        <Stack.Screen name="Channel" component={Channel} />
        <Stack.Screen name="ChannelInfo" component={ChannelInfo} />
        <Stack.Screen name="ArchivedChats" component={ArchivedChats} />
      </Stack.Navigator>
    </CheckProvider>
  );
};

export default ChatStack;

export type ChatStackParamList = {
  ChannelList: {
    channelId?: string;
  };
  NewChat: undefined;
  Channel: {
    channelId: string;
    initialData?: ChannelType;
  };
  ChannelInfo: {
    usersNo: number;
    userInfos: any;
    channel: any;
    userId: any;
  };
  ArchivedChats: {
    channels: any;
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

export type NewChatScreen = (
  props: ChatScreenProps<'NewChat'>,
) => ReactElement | null;

export type ChannelScreen = (
  props: ChatScreenProps<'Channel'>,
) => ReactElement | null;

export type ChannelInfoScreen = (
  props: ChatScreenProps<'ChannelInfo'>,
) => ReactElement | null;

export type ArchivedChatsScreen = (
  props: ChatScreenProps<'ArchivedChats'>,
) => ReactElement | null;
