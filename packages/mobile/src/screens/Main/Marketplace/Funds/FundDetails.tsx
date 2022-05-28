import React, { useState, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
import { useWatchFund } from 'shared/graphql/mutation/funds/useWatchFund';

import { FundDetailsScreen } from 'mobile/src/navigations/AuthenticatedStack';

const Tab = createMaterialTopTabNavigator();
const FundDetails: FundDetailsScreen = ({ route, navigation }) => {
  const { fundId } = route.params;
  const { data } = useFund(fundId);
  const { isWatching, toggleWatch } = useWatchFund(fundId);
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
            initialRouteName={
              tabviewHeight === documentsTabHeight.current
                ? 'Documents'
                : 'Overview'
            }>
            <Tab.Screen name="Overview">
              {({ navigation }) => {
                useEffect(() => {
                  const unsubscribe = navigation.addListener('tabPress', () => {
                    setTabViewHeight(overviewTabHeight.current);
                  });

                  return unsubscribe;
                }, [setTabViewHeight, navigation]);

                return (
                  <FundOverview
                    fund={fund}
                    onLayout={(event) => {
                      const { height } = event.nativeEvent.layout;
                      overviewTabHeight.current = height + styles.tabBar.height;

                      if (tabviewHeight === 500) {
                        setTabViewHeight(overviewTabHeight.current);
                      }
                    }}
                  />
                );
              }}
            </Tab.Screen>
            {fund.documents ? (
              <Tab.Screen name="Documents">
                {({ navigation }) => {
                  useEffect(() => {
                    const unsubscribe = navigation.addListener(
                      'tabPress',
                      () => {
                        setTabViewHeight(documentsTabHeight.current);
                        stopVideos();
                      },
                    );

                    return unsubscribe;
                  }, [setTabViewHeight, navigation]);

                  return (
                    <FundDocuments
                      fund={fund}
                      onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        documentsTabHeight.current =
                          height + styles.tabBar.height;
                      }}
                    />
                  );
                }}
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
  actionBar: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
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
