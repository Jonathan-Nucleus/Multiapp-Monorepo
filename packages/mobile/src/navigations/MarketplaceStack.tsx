import React, { ReactElement } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
import {
  BGDARK,
  BLACK,
  WHITE,
  GRAY2,
  BGHEADER,
  PRIMARY,
  PRIMARYSTATE,
} from 'shared/src/colors';
import pStyles from '../theme/pStyles';

import { Body1, Body2, Body3, H6 } from '../theme/fonts';
import PHeader from '../components/common/PHeader';
import PLabel from '../components/common/PLabel';
import ThreeDortSvg from '../assets/icons/three-dot.svg';
import SearchSvg from '../assets/icons/search.svg';
import ChatCenteredTextSvg from '../assets/icons/ChatCenteredText.svg';
import Avatar from '../assets/avatar.png';
import LogoSvg from 'shared/assets/images/logo-icon.svg';
import BellSvg from 'shared/assets/images/bell.svg';
import RoundImageView from '../components/common/RoundImageView';

import Funds from '../screens/Marketplace/Funds';
import Managers from '../screens/Marketplace/Managers';
import Companies from '../screens/Marketplace/Companies';

const MarketplaceStack = () => {
  return (
    <View style={styles.globalContainer}>
      <PHeader
        leftIcon={
          <View style={styles.headerLogoContainer}>
            <LogoSvg />
            <PLabel
              label="Prometheus"
              textStyle={styles.logoText}
              viewStyle={styles.logoTextWrapper}
            />
          </View>
        }
        rightIcon={
          <View style={styles.headerIconContainer}>
            <SearchSvg />
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}>
              <BellSvg style={styles.headerIcon} />
            </TouchableOpacity>
            <RoundImageView image={Avatar} imageStyle={styles.avatarImage} />
          </View>
        }
        containerStyle={styles.headerContainer}
      />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.tabBarIndicator,
          tabBarActiveTintColor: WHITE,
          tabBarInactiveTintColor: PRIMARY,
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabBarLabel,
                Body3,
                { color },
                focused ? styles.bold : {},
              ]}>
              {route.name}
            </Text>
          ),
        })}
        initialRouteName="Funds">
        <Tab.Screen name="Funds" component={Funds} />
        <Tab.Screen name="Managers" component={Managers} />
        <Tab.Screen name="Companies" component={Companies} />
      </Tab.Navigator>
    </View>
  );
};

export default MarketplaceStack;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    backgroundColor: BLACK,
  },
  tabBar: {
    backgroundColor: BGHEADER,
    marginTop: 0,
    paddingTop: 0,
  },
  tabBarIndicator: {
    backgroundColor: PRIMARYSTATE,
  },
  tabBarLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1.25,
  },
  bold: {
    fontWeight: 'bold',
  },
  headerContainer: {
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: BGHEADER,
    marginBottom: 1,
  },
  headerLogoContainer: {
    flexDirection: 'row',
  },
  logoTextWrapper: {
    marginLeft: 8,
  },
  logoText: {
    ...H6,
  },
  headerIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    marginHorizontal: 20,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
