import React, { ReactElement } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';

import Home from '../screens/Home';
import CreatePost from '../screens/Home/CreatePost';
import ChooseCategory from '../screens/Home/ChooseCategory';

const Stack = createStackNavigator();

type HomeStackParamList = {
  Home: undefined;
  CreatePost: { categories: string[] };
  ChooseCategory: undefined;
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

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CreatePost" component={CreatePost} />
      <Stack.Screen name="ChooseCategory" component={ChooseCategory} />
    </Stack.Navigator>
  );
};

export default HomeStack;
