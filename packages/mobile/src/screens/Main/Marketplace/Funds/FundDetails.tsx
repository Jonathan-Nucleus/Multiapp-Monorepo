import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationProp,
} from '@react-navigation/material-top-tabs';
import { CaretLeft } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MainHeader from 'mobile/src/components/main/Header';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import pStyles from 'mobile/src/theme/pStyles';
import { Body2 } from 'mobile/src/theme/fonts';
import {
  BLACK,
  PRIMARYSTATE,
  WHITE,
  WHITE12,
  WHITE60,
} from 'shared/src/colors';

import { stopVideos } from 'mobile/src/components/common/Media';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import FundProfileInfo from './FundProfileInfo';
import FundOverview from './FundOverview';
import FundDocuments from './FundDocuments';
import FundsPlaceholder from 'mobile/src/components/placeholder/FundsPlaceholder';

import { useFund } from 'shared/graphql/query/marketplace/useFund';

import { FundDetailsScreen } from 'mobile/src/navigations/AuthenticatedStack';

export type FundDetailsTabs = MaterialTopTabNavigationProp<{
  Overview: never;
  Documents: never;
}>;

const Tab = createMaterialTopTabNavigator();
const FundDetails: FundDetailsScreen = ({ route, navigation }) => {
  const { fundId } = route.params;
  const { data } = useFund(fundId);
  const [tabviewHeight, setTabViewHeight] = useState<number>(500);
  const overviewTabHeight = useRef(0);
  const documentsTabHeight = useRef(0);

  useFocusEffect(() => () => {
    stopVideos();
  });

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

  const contactSpecialist = (): void => {
    navigation.navigate('Contact', {
      fundId: fund._id,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <MainHeader
        leftIcon={<CaretLeft size={32} color={WHITE} />}
        onPressLeft={() => NavigationService.goBack()}
      />
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <FundProfileInfo fund={fund} />
        <View
          style={[
            styles.tabView,
            {
              ...(tabviewHeight !== null
                ? { height: tabviewHeight }
                : { flex: 1 }),
            },
          ]}>
          <Tab.Navigator
            sceneContainerStyle={styles.tabContainer}
            backBehavior="none"
            screenOptions={({ route: tabRoute }) => ({
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
                  {tabRoute.name}
                </Text>
              ),
            })}
            initialRouteName={
              tabviewHeight === documentsTabHeight.current
                ? 'Documents'
                : 'Overview'
            }>
            <Tab.Screen name="Overview">
              {() => (
                <FundOverview
                  fund={fund}
                  onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    overviewTabHeight.current = height + styles.tabBar.height;

                    if (tabviewHeight === 500) {
                      setTabViewHeight(overviewTabHeight.current);
                    }
                  }}
                  onFocus={() => {
                    setTabViewHeight(overviewTabHeight.current);
                  }}
                />
              )}
            </Tab.Screen>
            {fund.documents ? (
              <Tab.Screen name="Documents">
                {() => (
                  <FundDocuments
                    fund={fund}
                    onLayout={(event) => {
                      const { height } = event.nativeEvent.layout;
                      documentsTabHeight.current =
                        height + styles.tabBar.height;
                    }}
                    onFocus={() => {
                      stopVideos();
                      setTabViewHeight(documentsTabHeight.current);
                    }}
                  />
                )}
              </Tab.Screen>
            ) : null}
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
  tabView: {
    borderColor: WHITE12,
    borderTopWidth: 1,
  },
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
  contactContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: BLACK,
  },
});
