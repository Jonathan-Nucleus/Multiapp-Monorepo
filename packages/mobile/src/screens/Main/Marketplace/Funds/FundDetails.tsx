import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import analytics from '@react-native-firebase/analytics';

import MainHeader from 'mobile/src/components/main/Header';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import PText from 'mobile/src/components/common/PText';
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
import FundProfileInfo from 'mobile/src/components/main/funds/FundProfileInfo';
import FundOverview from './FundOverview';
import FundDocuments from './FundDocuments';
import FundsPlaceholder from 'mobile/src/components/placeholder/FundsPlaceholder';

import { useFund } from 'shared/graphql/query/marketplace/useFund';

import { FundDetailsScreen } from 'mobile/src/navigations/AuthenticatedStack';

const FundDetails: FundDetailsScreen = ({ route, navigation }) => {
  const { fundId } = route.params;
  const { data } = useFund(fundId);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents'>(
    'overview',
  );
  const fund = data?.fund;

  useFocusEffect(() => () => {
    stopVideos();
  });

  useEffect(() => {
    if (fund && process.env.ENV === 'prod') {
      analytics().logScreenView({
        screen_name: `${route.name} - ${fund.company.name}`,
        screen_class: `${route.name} - ${fund.company.name}`,
      });
    }
  }, [fund, route.name]);

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
        <View style={styles.row}>
          <Pressable
            onPress={() => setActiveTab('overview')}
            style={[
              styles.tab,
              activeTab === 'overview' ? styles.active : null,
            ]}>
            <PText
              style={[
                styles.tabBarLabel,
                activeTab === 'overview' ? styles.white : null,
              ]}>
              Overview
            </PText>
          </Pressable>
          {fund.documents ? (
            <Pressable
              onPress={() => setActiveTab('documents')}
              style={[
                styles.tab,
                activeTab === 'documents' ? styles.active : null,
              ]}>
              <PText
                style={[
                  styles.tabBarLabel,
                  activeTab === 'documents' ? styles.white : null,
                ]}>
                Documents
              </PText>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.row}>
          <FundOverview
            fund={fund}
            style={[
              styles.tabView,
              activeTab !== 'overview' ? styles.hidden : null,
            ]}
          />
          {fund.documents ? (
            <FundDocuments
              fund={fund}
              style={[
                styles.tabView,
                activeTab !== 'documents' ? styles.hidden : null,
              ]}
            />
          ) : null}
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
  row: {
    flexDirection: 'row',
  },
  tabView: {
    width: Dimensions.get('window').width,
  },
  tab: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: 'transparent',
    borderBottomWidth: 2,
    borderTopColor: WHITE12,
    borderTopWidth: 1,
  },
  tabBarLabel: {
    letterSpacing: 1.25,
    color: WHITE60,
    fontWeight: '500',
    ...Body2,
  },
  hidden: {
    display: 'none',
  },
  active: {
    borderBottomColor: PRIMARYSTATE,
  },
  white: {
    color: WHITE,
  },
  contactContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: BLACK,
  },
});
