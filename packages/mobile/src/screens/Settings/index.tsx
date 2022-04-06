import React, { FC, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BGDARK,
  GRAY2,
  GRAY100,
  WHITE,
  BLACK,
  PRIMARYSOLID7,
} from 'shared/src/colors';

import PHeader from '../../components/common/PHeader';
import pStyles from '../../theme/pStyles';
import { Body1, Body2, Body3 } from '../../theme/fonts';

const DATA = [
  {
    id: '1',
    label: 'Settings',
    onPress: () => console.log(12312),
  },
  {
    id: '2',
    label: 'Terms and Disclosures',
    onPress: () => console.log(12312),
  },
  {
    id: '3',
    label: 'Help & Support',
    onPress: () => console.log(12312),
  },
  {
    id: '4',
    label: 'Delete Account',
    onPress: () => console.log(12312),
  },
];

const Settings: FC = ({ navigation }) => {
  const renderListItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Detail')}>
        <View style={styles.item}>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PHeader
        centerIcon={<Text style={styles.headerTitle}>Settings</Text>}
        containerStyle={styles.headerContainer}
      />
      <FlatList
        data={DATA}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
        ListFooterComponent={
          <View>
            <Text>Logout</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    ...Body1,
    color: WHITE,
  },
  flatList: {
    flex: 1,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 54,
    height: 54,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: PRIMARYSOLID7,
    marginTop: 16,
  },
  commentWrap: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    ...Body2,
    color: WHITE,
  },
  comment: {
    color: GRAY100,
    ...Body3,
  },
});
