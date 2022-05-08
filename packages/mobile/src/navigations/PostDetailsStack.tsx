import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';

import CreatePost from '../screens/PostDetails/CreatePost';
import PostDetail from '../screens/PostDetails/PostDetail';
import ChooseCategory from '../screens/PostDetails/CreatePost/ChooseCategory';
import ReviewPost from '../screens/PostDetails/CreatePost/ReviewPost';

import type { AppScreenProps } from './AppNavigator';

import { Post, PostCategory } from 'mobile/src/graphql/query/post/usePosts';
import type { Audience } from 'mobile/src/graphql/query/post/usePosts';

const Stack = createStackNavigator();
const PostDetailsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="CreatePost">
      <Stack.Screen name="CreatePost" component={CreatePost} />
      <Stack.Screen name="ChooseCategory" component={ChooseCategory} />
      <Stack.Screen name="ReviewPost" component={ReviewPost} />
      <Stack.Screen name="PostDetail" component={PostDetail} />
    </Stack.Navigator>
  );
};

export default PostDetailsStack;

export type PostDetailsStackParamList = {
  CreatePost: {
    id?: string;
    editPost?: boolean;
    user: string;
    audience: Audience;
    company: boolean;
    description?: string;
    mentions: string[];
    mediaUrl?: string;
    localMediaPath?: string;
    categories?: PostCategory[];
  };
  ChooseCategory: PostDetailsStackParamList['CreatePost'];
  ReviewPost: PostDetailsStackParamList['CreatePost'];
  PostDetail: { postId: string; userId: string };
};

export type PostDetailsScreenProps<
  RouteName extends keyof PostDetailsStackParamList = keyof PostDetailsStackParamList,
> = CompositeScreenProps<
  StackScreenProps<PostDetailsStackParamList, RouteName>,
  AppScreenProps
>;

export type CreatePostScreen = (
  props: PostDetailsScreenProps<'CreatePost'>,
) => ReactElement | null;

export type ChooseCategoryScreen = (
  props: PostDetailsScreenProps<'ChooseCategory'>,
) => ReactElement;

export type ReviewPostScreen = (
  props: PostDetailsScreenProps<'ReviewPost'>,
) => ReactElement;

export type PostDetailScreen = (
  props: PostDetailsScreenProps<'PostDetail'>,
) => ReactElement;
