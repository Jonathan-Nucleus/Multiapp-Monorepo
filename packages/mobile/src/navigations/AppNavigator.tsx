import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import analytics from '@react-native-firebase/analytics';

const Stack = createStackNavigator();

import AuthStack from './AuthStack';
import BottomTabNavigator from './BottomTabNavigator';
import * as NavigationService from '../services/navigation/NavigationService';

const defaultScreenOptions = {
  headerShown: false,
  gestureEnabled: false,
};

const AppNavigator = () => {
  const navigationRef = useRef(null);
  const routeNameRef = useRef(null);

  useEffect(() => {
    NavigationService.setNavigator(navigationRef.current);
  }, []);

  const onReady = () => {
    routeNameRef.current = navigationRef.current.getCurrentRoute().name;
    console.log('Running', routeNameRef.current);
  };

  const onStateChange = async () => {
    const prev = routeNameRef.current;
    const current = navigationRef.current.getCurrentRoute().name;
    console.log('Current: ', current);
    console.log('Prev: ', prev);
    if (prev !== current) {
      // await analytics().logScreenView({
      //   screen_name: current,
      //   screen_class: current,
      // });
    }

    routeNameRef.current = current;
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={onReady}
      onStateChange={onStateChange}
    >
      <Stack.Navigator screenOptions={defaultScreenOptions}>
        {/* <Stack.Screen
          name="SignUp"
          component={AuthStack}
          options={{ gestureEnabled: false }}
        /> */}
        <Stack.Screen name="Tabs" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
