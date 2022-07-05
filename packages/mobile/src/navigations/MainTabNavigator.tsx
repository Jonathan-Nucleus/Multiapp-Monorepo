import React, { ReactElement, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { Chats, DotsThreeCircle, House, Star } from 'phosphor-react-native';

import FundsSVG from 'shared/assets/images/logo-icon.svg';
import GreyFundsSVG from 'shared/assets/images/grey-fund.svg';
import { BLACK, GRAY400, GRAY700, WHITE, WHITE12 } from 'shared/src/colors';
import { Body3 } from 'mobile/src/theme/fonts';

import { Home } from 'mobile/src/screens/Main/Home';
import WatchList from 'mobile/src/screens/Main/WatchList';
import MarketplaceTabs, { MarketplaceTabsParamList } from './MarketplaceTabs';
import ChatStack, { ChatStackParamList } from './ChatStack';
import MoreStack, { MoreStackParamList } from './MoreStack';
import { Body5, Body5Bold } from '../theme/fonts';

import { useChatContext, useUnreadCount } from 'mobile/src/context/Chat';

import type { AuthenticatedScreenProps } from './AuthenticatedStack';
import pStyles from '../theme/pStyles';
import Tooltip from 'react-native-walkthrough-tooltip';
import { EventRegister } from 'react-native-event-listeners';

const Tab = createBottomTabNavigator();
const MainTabNavigator = (): React.ReactElement => {
  const { client } = useChatContext() || {};
  const unreadCount = useUnreadCount();
  const [showTutorial, setShowTutorial] = useState(false);
  useEffect(() => {
    EventRegister.addEventListener('tabTutorial', () => {
      setShowTutorial(true);
    });
  }, []);

  const closeTutorial = () => {
    EventRegister.emit('homeTutorial');
    setShowTutorial(false);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: BLACK,
          borderTopWidth: 1,
          borderTopColor: WHITE12,
        },
        tabBarLabelStyle: {
          textTransform: 'uppercase',
        },
        tabBarShowLabel: true,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.text, focused && styles.bold]}>HOME</Text>
          ),
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <Tooltip
                isVisible={showTutorial}
                content={
                  <View style={pStyles.tooltipContainer}>
                    <Text style={pStyles.tooltipText}>
                      This is your newsfeed! Market insights from professionals
                      live here.
                    </Text>
                    <Pressable
                      onPress={() => closeTutorial()}
                      style={pStyles.tooltipButton}>
                      <Text style={pStyles.tooltipButtonText}>Next</Text>
                    </Pressable>
                  </View>
                }
                contentStyle={pStyles.tooltipContent}
                placement="top"
                onClose={() => console.log('')}>
                <House size={size} color={WHITE} weight="fill" />
              </Tooltip>
            ) : (
              <House size={size} color={GRAY400} />
            ),
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchList}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.text, focused && styles.bold]}>watchlist</Text>
          ),
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <Star size={size} color={WHITE} weight="fill" />
            ) : (
              <Star size={size} color={GRAY400} />
            ),
        }}
      />
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceTabs}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.text, focused && styles.bold]}>funds</Text>
          ),
          tabBarIcon: ({ focused }) =>
            focused ? <FundsSVG /> : <GreyFundsSVG />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.text, focused && styles.bold]}>messages</Text>
          ),
          tabBarIcon: ({ focused, size }) => (
            <View style={styles.relative}>
              {focused ? (
                <Chats size={size} color={WHITE} weight="fill" />
              ) : (
                <Chats size={size} color={client ? GRAY400 : GRAY700} />
              )}
              {unreadCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              ) : null}
            </View>
          ),
        }}
        listeners={{
          tabPress: (evt) => {
            if (!client) {
              console.log('Messenger disabled');
              evt.preventDefault();
            }
          },
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreStack}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.text, focused && styles.bold]}>MORE</Text>
          ),
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <DotsThreeCircle size={size} color={WHITE} weight="fill" />
            ) : (
              <DotsThreeCircle size={size} color={GRAY400} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

export type MainTabParamList = {
  Home: BottomTabScreenProps<Record<string, never>>;
  Watchlist: BottomTabScreenProps<Record<string, never>>;
  Marketplace: NavigatorScreenParams<MarketplaceTabsParamList> | undefined;
  Chat: NavigatorScreenParams<ChatStackParamList> | undefined;
  More: NavigatorScreenParams<MoreStackParamList> | undefined;
};

export type MainTabScreenProps<
  RouteName extends keyof MainTabParamList = keyof MainTabParamList,
> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, RouteName>,
  AuthenticatedScreenProps
>;

export type HomeScreen = (
  props: MainTabScreenProps<'Home'>,
) => ReactElement | null;

export type WatchlistScreen = (
  props: MainTabScreenProps<'Watchlist'>,
) => ReactElement | null;

export type SettingsScreen = (
  props: MainTabScreenProps<'More'>,
) => ReactElement | null;

const styles = StyleSheet.create({
  relative: {
    position: 'relative',
  },
  text: {
    ...Body5,
    color: GRAY400,
    textTransform: 'uppercase',
  },
  bold: {
    ...Body5Bold,
    color: WHITE,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    paddingHorizontal: 4,
    borderRadius: 8,
    padding: 2,
    height: 16,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: WHITE,
    lineHeight: 16,
    ...Body3,
  },
});
