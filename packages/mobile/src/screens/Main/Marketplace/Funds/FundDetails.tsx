import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { CaretLeft, Star } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MainHeader from 'mobile/src/components/main/Header';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import pStyles from 'mobile/src/theme/pStyles';
import { Body2 } from 'mobile/src/theme/fonts';
import {
  BLACK,
  PRIMARYSTATE,
  PRIMARYDARK,
  WHITE,
  WHITE12,
  WHITE60,
} from 'shared/src/colors';

import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import FundProfileInfo from './FundProfileInfo';
import FundOverview from './FundOverview';
import FundsPlaceholder from 'mobile/src/components/placeholder/FundsPlaceholder';

import { useFund } from 'shared/graphql/query/marketplace/useFund';
import { useWatchFund } from 'shared/graphql/mutation/funds/useWatchFund';

import { FundDetailsScreen } from 'mobile/src/navigations/AppNavigator';

const Tab = createMaterialTopTabNavigator();
const FundDetails: FundDetailsScreen = ({ route, navigation }) => {
  const { fundId } = route.params;
  const { data } = useFund(fundId);
  const { isWatching, toggleWatch } = useWatchFund(fundId);
  const [tabviewHeight, setTabViewHeight] = useState<number>(500);

  const fund = data?.fund;
  if (!fund) {
    return (
      <View style={pStyles.globalContainer}>
        <MainHeader
          leftIcon={<CaretLeft size={32} color={WHITE} />}
          onPressLeft={() => NavigationService.goBack()}
        />
        <FundsPlaceholder />
      </View>
    );
  }

  const contactSpecialist = () => {
    navigation.navigate('Contact');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <MainHeader
        leftIcon={<CaretLeft size={32} color={WHITE} />}
        onPressLeft={() => NavigationService.goBack()}
      />
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <FundProfileInfo fund={fund} />
        <View style={styles.actionBar}>
          <Pressable
            onPress={toggleWatch}
            style={({ pressed }) => [pressed ? styles.onPress : undefined]}>
            <Star
              size={24}
              color={isWatching ? PRIMARYSTATE : WHITE}
              style={styles.favorite}
              weight={isWatching ? 'fill' : 'regular'}
            />
          </Pressable>
          {/* Remove until actions have been defined.
            <DotsThreeOutlineVertical size={24} color={WHITE} />
            */}
        </View>
        <View
          style={{
            ...(tabviewHeight !== null
              ? { height: tabviewHeight }
              : { flex: 1 }),
          }}>
          <Tab.Navigator
            sceneContainerStyle={styles.tabContainer}
            screenOptions={({ route }) => ({
              swipeEnabled: false, // disabled swipe to scroll team members properly
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
            <Tab.Screen name="Overview">
              {() => (
                <FundOverview
                  fund={fund}
                  onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    setTabViewHeight(height + styles.tabBar.height);
                  }}
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="Documents">{() => <></>}</Tab.Screen>
          </Tab.Navigator>
        </View>
      </ScrollView>
      <View style={styles.contactContainer}>
        <PGradientButton
          label="Contact Fund Specialist"
          onPress={contactSpecialist}
        />
      </View>
    </SafeAreaView>
  );
};

export default FundDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  actionBar: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
  },
  headerContainer: {
    backgroundColor: BLACK,
    marginBottom: 0,
    height: 62,
  },
  sideStyle: {
    top: 16,
  },
  favorite: {},
  tabContainer: {
    backgroundColor: BLACK,
  },
  tabBar: {
    backgroundColor: BLACK,
    marginTop: 0,
    paddingTop: 0,
    height: 48,
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
  onPress: {
    opacity: 0.5,
  },
  contactContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: BLACK,
  },
});
