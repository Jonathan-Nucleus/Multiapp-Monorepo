import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';

import { Home } from '../screens/Home';
import Notification from '../screens/Notification';
import NotificationDetail from '../screens/Notification/Details';
import ChooseCategory from '../screens/Home/ChooseCategory';
import ReviewPost from '../screens/Home/ReviewPost';
import PostDetail from '../screens/Home/PostDetail';
import { Post, PostCategory } from 'mobile/src/graphql/query/post/usePosts';
import type { Audience } from 'mobile/src/graphql/query/post/usePosts';

const Stack = createStackNavigator();

type HomeStackParamList = {
  Home: undefined;
  CreatePost: undefined;
  ChooseCategory: {
    user: string;
    audience: Audience;
    company: boolean;
    description?: string;
    mentions: string[];
    mediaUrl?: string;
    localMediaPath?: string;
  };
  ReviewPost: HomeStackParamList['ChooseCategory'] & {
    categories: PostCategory[];
  };
  PostDetail: { postId: string; userId: string };
  Notification: undefined;
  NotificationDetail: { postId: string; userId: string };
};

export type HomeScreen = (
  props: StackScreenProps<HomeStackParamList, 'Home'>,
) => ReactElement;

export type CreatePostScreen = (
  props: StackScreenProps<HomeStackParamList, 'CreatePost'>,
) => ReactElement;

export type ChooseCategoryScreen = (
  props: StackScreenProps<HomeStackParamList, 'ChooseCategory'>,
) => ReactElement;

export type ReviewPostScreen = (
  props: StackScreenProps<HomeStackParamList, 'ReviewPost'>,
) => ReactElement;

export type PostDetailScreen = (
  props: StackScreenProps<HomeStackParamList, 'PostDetail'>,
) => ReactElement;

export type NotificationScreen = (
  props: StackScreenProps<HomeStackParamList, 'Notification'>,
) => ReactElement;

export type NotificationDetailsScreen = (
  props: StackScreenProps<HomeStackParamList, 'NotificationDetail'>,
) => ReactElement;

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetail} />
      <Stack.Screen name="ChooseCategory" component={ChooseCategory} />
      <Stack.Screen name="ReviewPost" component={ReviewPost} />
      <Stack.Screen name="PostDetail" component={PostDetail} />
    </Stack.Navigator>
  );
};

export default HomeStack;
