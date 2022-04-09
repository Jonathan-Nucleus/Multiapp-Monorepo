import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BGDARK, GRAY2, GRAY100, WHITE } from 'shared/src/colors';

import pStyles from '../../../theme/pStyles';
import PHeader from '../../../components/common/PHeader';
import RoundIcon from '../../../components/common/RoundIcon';

import { Body1, Body2, Body3 } from '../../../theme/fonts';
import SearchSvg from '../../../assets/icons/search.svg';
import BackSvg from '../../../assets/icons/back.svg';

import type { NotificationDetailsScreen } from 'mobile/src/navigations/NotificationStack';

const NotificationDetail: NotificationDetailsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PHeader
        leftIcon={
          <RoundIcon icon={<BackSvg />} onPress={() => navigation.goBack()} />
        }
        centerIcon={
          <Text style={styles.headerTitle}>Richard Branson’s Post</Text>
        }
        rightIcon={
          <RoundIcon icon={<SearchSvg />} onPress={() => navigation.goBack()} />
        }
        containerStyle={styles.headerContainer}
      />
      <Text>Detail</Text>
    </SafeAreaView>
  );
};

export default NotificationDetail;

const styles = StyleSheet.create({
  headerTitle: {
    ...Body1,
    color: WHITE,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BGDARK,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    paddingTop: 0,
    marginBottom: 0,
  },
});
