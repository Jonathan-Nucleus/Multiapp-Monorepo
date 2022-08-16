import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';

import CreatePost, { LocalMedia } from '../screens/PostDetails/CreatePost';
import SharePost from '../screens/PostDetails/SharePost';
import PostDetail from '../screens/PostDetails/PostDetail';
import ChooseCategory from '../screens/PostDetails/CreatePost/ChooseCategory';
import ReviewPost from '../screens/PostDetails/CreatePost/ReviewPost';

import type { AuthenticatedScreenProps } from './AuthenticatedStack';
import type { Post, PostCategory } from 'shared/graphql/query/post/usePosts';

const Stack = createStackNavigator();
const PostDetailsStack = (): ReactElement => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="CreatePost">
      <Stack.Screen name="CreatePost" component={CreatePost} />
      <Stack.Screen name="SharePost" component={SharePost} />
      <Stack.Screen name="ChooseCategory" component={ChooseCategory} />
      <Stack.Screen name="ReviewPost" component={ReviewPost} />
      <Stack.Screen name="PostDetail" component={PostDetail} />
    </Stack.Navigator>
  );
};

export default PostDetailsStack;

export type PostDetailsStackParamList = {
  CreatePost: {
    post?: Pick<
      Post,
      | '_id'
      | 'audience'
      | 'categories'
      | 'body'
      | 'media'
      | 'mentionIds'
      | 'userId'
    >;
  };
  SharePost: {
    sharePostId: string;
  };
  ChooseCategory: {
    _id?: string;
    userId: Post['userId'];
    audience: Post['audience'];
    body?: Post['body'];
    mentionIds: Post['mentionIds'];
    media?: LocalMedia[];
    categories?: PostCategory[];
  };
  ReviewPost: PostDetailsStackParamList['ChooseCategory'] & {
    categories: PostCategory[];
  };
  PostDetail: { postId: string; focusComment?: boolean };
};

export type PostDetailsScreenProps<
  RouteName extends keyof PostDetailsStackParamList = keyof PostDetailsStackParamList,
> = CompositeScreenProps<
  StackScreenProps<PostDetailsStackParamList, RouteName>,
  AuthenticatedScreenProps
>;

export type CreatePostScreen = (
  props: PostDetailsScreenProps<'CreatePost'>,
) => ReactElement | null;

export type SharePostScreen = (
  props: PostDetailsScreenProps<'SharePost'>,
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
