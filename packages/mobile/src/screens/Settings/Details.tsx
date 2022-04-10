import React, { FC, useState } from 'react';
import { StyleSheet, FlatList, View, Text, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';

import { CaretLeft, MagnifyingGlass } from 'phosphor-react-native';

import {
  BGDARK,
  GRAY20,
  GRAY100,
  WHITE,
  GREEN,
  PRIMARYSOLID7,
} from 'shared/src/colors';

import PHeader from '../../components/common/PHeader';
import pStyles from '../../theme/pStyles';
import { Body1, Body2, Body3 } from '../../theme/fonts';

interface renderItemProps {
  item: {
    label1: string;
    label2?: string;
    toggleSwitch?: () => void;
    isEnabled?: boolean;
  };
}

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const DATA = [
  {
    label1: 'Allow tagging',
    label2:
      'If allowed, users my tag you in posts, comments and messages using the @mention feature.',
  },
  {
    label1: 'Allow Messages',
    label2: 'If allowed, users may message you within Prometheus Alts',
  },
  {
    label1: 'Receive messages by email',
  },
  {
    label1: 'Mobile Push',
  },
  {
    label1: 'New post from people or companies you’re following',
  },
  {
    label1: 'Likes on your posts',
  },
  {
    label1: 'Comments on your posts',
  },
  {
    label1: 'Likes on your comments',
  },
  {
    label1: 'Tagged in a post, comment, or profile page',
  },
];

const SettingDetails: FC<RouterProps> = ({ navigation }) => {
  const [isEnabled, setEnable] = useState(false);

  const renderListItem = ({ item }: renderItemProps) => {
    return (
      <View style={styles.item}>
        <View style={styles.leftItem}>
          <Text style={styles.label}>{item.label1}</Text>
          <Text style={styles.comment}>{item.label2}</Text>
        </View>
        <Switch
          trackColor={{ false: GRAY20, true: GREEN }}
          ios_backgroundColor={GRAY20}
          onValueChange={setEnable}
          value={isEnabled}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PHeader
        centerIcon={<Text style={styles.headerTitle}>Preferences</Text>}
        containerStyle={styles.headerContainer}
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        rightIcon={<MagnifyingGlass size={28} color={WHITE} />}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => console.log(1231)}
      />
      <FlatList
        data={DATA}
        // ListHeaderComponent={<Text style={styles.label}>Notifications</Text>}
        renderItem={renderListItem}
        keyExtractor={(item, index) => `notification${index}`}
        style={styles.flatList}
        listKey="notification"
        ListHeaderComponentStyle={styles.listHeader}
      />
    </SafeAreaView>
  );
};

export default SettingDetails;

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
  label: {
    ...Body2,
    color: WHITE,
  },
  comment: {
    color: GRAY100,
    ...Body3,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    backgroundColor: PRIMARYSOLID7,
    marginTop: 16,
  },
  leftItem: {
    marginRight: 10,
    flex: 1,
  },
  flatList: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  listHeader: {
    marginBottom: 8,
  },
});
