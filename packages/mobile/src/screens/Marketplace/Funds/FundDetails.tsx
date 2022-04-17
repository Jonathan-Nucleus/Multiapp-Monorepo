import React from 'react';

import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  CaretLeft,
  DotsThreeOutlineVertical,
  Star,
} from 'phosphor-react-native';

import MainHeader from '../../../components/main/Header';
import { FundDetailsScreen } from '../../../navigations/FundsStack';
import FundProfileInfo from '../../../components/main/FundProfileInfo';
import FundOverview from './FundOverview';

import {
  BLACK,
  PRIMARYSTATE,
  WHITE,
  WHITE12,
  WHITE60,
} from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';
import { Body2 } from '../../../theme/fonts';

const Tab = createMaterialTopTabNavigator();

const FundDetails: FundDetailsScreen = ({ route, navigation }) => {
  const { fund } = route.params;
  return (
    <ScrollView style={pStyles.globalContainer}>
      <MainHeader
        leftIcon={<CaretLeft size={32} color={WHITE} />}
        onPressLeft={() => navigation.goBack()}
      />
      <FundProfileInfo fund={fund} />
      <View style={styles.actionBar}>
        <Star size={24} color={WHITE} style={styles.favorite} />
        <DotsThreeOutlineVertical size={24} color={WHITE} />
      </View>
      {/* TODO: use ohter lib for tab bar like react-native-tab-view */}
      <View style={{ height: 1000 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarStyle: styles.tabBar,
            tabBarIndicatorStyle: styles.tabBarIndicator,
            tabBarActiveTintColor: WHITE,
            tabBarInactiveTintColor: WHITE60,
            tabBarLabel: ({ focused, color }) => (
              <Text
                style={[
                  styles.tabBarLabel,
                  Body2,
                  { color },
                  focused ? styles.bold : {},
                ]}>
                {route.name}
              </Text>
            ),
          })}
          initialRouteName="FundOverview">
          <Tab.Screen
            name="Overview"
            component={() => <FundOverview fund={fund} />}
          />
          <Tab.Screen
            name="Documents"
            component={() => <FundOverview fund={fund} />}
          />
        </Tab.Navigator>
      </View>
    </ScrollView>
  );
};

export default FundDetails;

const styles = StyleSheet.create({
  actionBar: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
  },
  favorite: {},
  tabBar: {
    backgroundColor: BLACK,
    marginTop: 0,
    paddingTop: 0,
  },
  tabBarIndicator: {
    backgroundColor: PRIMARYSTATE,
  },
  tabBarLabel: {
    letterSpacing: 1.25,
  },
  bold: {
    fontWeight: 'bold',
  },
});
