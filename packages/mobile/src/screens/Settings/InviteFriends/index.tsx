import React, { FC, useState } from 'react';
import { StyleSheet, FlatList, View, Text, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { CaretLeft, MagnifyingGlass } from 'phosphor-react-native';
import { WHITE, BGDARK } from 'shared/src/colors';

import PHeader from '../../../components/common/PHeader';
import pStyles from '../../../theme/pStyles';
import { Body1, Body2, Body3 } from '../../../theme/fonts';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const InviteFriends: FC<RouterProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PHeader
        centerIcon={<Text style={styles.headerTitle}>Invite Friends</Text>}
        containerStyle={styles.headerContainer}
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        rightIcon={<MagnifyingGlass size={28} color={WHITE} />}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => console.log(1231)}
      />
    </SafeAreaView>
  );
};

export default InviteFriends;

const styles = StyleSheet.create({
  headerTitle: {
    ...Body1,
    color: WHITE,
  },
  headerContainer: {
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
    justifyContent: 'space-between',
  },
});
