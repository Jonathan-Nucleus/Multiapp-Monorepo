import React, { FC, useState } from 'react';
import { StyleSheet, FlatList, View, Text, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { CaretLeft, MagnifyingGlass } from 'phosphor-react-native';
import { WHITE, BGDARK } from 'shared/src/colors';

import PHeader from 'mobile/src/components/common/PHeader';
import pStyles from 'mobile/src/theme/pStyles';
import { Body1, Body2, Body3 } from 'mobile/src/theme/fonts';
import MainHeader from 'mobile/src/components/main/Header';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}
const Chat: FC<RouterProps> = ({ navigation }) => {
  return (
    <View style={pStyles.globalContainer}>
      <MainHeader
        leftIcon={
          <View style={styles.row}>
            <CaretLeft size={28} color={WHITE} />
            <Text style={styles.headerTitle} numberOfLines={1}>
              Chat
            </Text>
          </View>
        }
        onPressLeft={navigation.goBack}
      />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  headerTitle: {
    ...Body1,
    color: WHITE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
