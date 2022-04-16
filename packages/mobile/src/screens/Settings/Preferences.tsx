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
import { Body1, Body1Bold, Body2, Body2Bold, Body3 } from '../../theme/fonts';
import PAppContainer from '../../components/common/PAppContainer';
import MainHeader from '../../components/main/Header';

interface renderItemProps {
  item: {
    label1: string;
    label2?: string;
    toggleSwitch?: () => void;
    isEnabled?: boolean;
    id: number;
    value: boolean;
  };
}

interface selectedItemProps {
  id: number;
  value: boolean;
}

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Gnerals = [
  {
    label1: 'Allow tagging',
    label2:
      'If allowed, users my tag you in posts, comments and messages using the @mention feature.',
    value: false,
    id: 11,
  },
];

const Messaging = [
  {
    label1: 'Allow Messages',
    label2: 'If allowed, users may message you within Prometheus Alts',
    value: false,
    id: 22,
  },
  {
    label1: 'Receive messages by email',
    value: false,
    id: 33,
  },
];

const NotificationsMethods = [
  {
    label1: 'Mobile Push',
    value: false,
    id: 44,
  },
  {
    label1: 'Email',
    value: false,
    id: 442,
  },
];

const Notifications = [
  {
    label1: 'New post from people or companies you’re following',
    value: true,
    id: 55,
  },
  {
    label1: 'Likes on your posts',
    value: true,
    id: 66,
  },
  {
    label1: 'Comments on you rposts',
    value: true,
    id: 626,
  },
  {
    label1: 'Tagged in a post, comment or profile page',
    value: true,
    id: 661,
  },
  {
    label1: 'New Messages',
    value: true,
    id: 665,
  },
];

const Preferences: FC<RouterProps> = ({ navigation }) => {
  const [enabledList, setEnabledList] = useState<selectedItemProps[]>([]);

  const handleToogleSelect = (val: boolean, item: renderItemProps) => {
    const _enabledList = [...enabledList];
    const objIndex = _enabledList.findIndex((v) => v.id === item.id);
    if (objIndex > -1) {
      _enabledList[objIndex].value = val;
    } else {
      _enabledList.push({
        id: item.id,
        value: val,
      });
    }

    setEnabledList(_enabledList);
  };

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
          onValueChange={(val) => handleToogleSelect(val, item)}
          value={enabledList.findIndex((v) => v.id === item.id && v.value) > -1}
        />
      </View>
    );
  };

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader
        leftIcon={
          <View style={styles.row}>
            <CaretLeft size={28} color={WHITE} />
            <Text style={styles.headerTitle}>Preferences</Text>
          </View>
        }
        onPressLeft={() => navigation.goBack()}
      />
      <PAppContainer>
        <View style={styles.listHeader}>
          <Text style={styles.title}>General</Text>
        </View>
        <FlatList
          data={Gnerals}
          renderItem={renderListItem}
          keyExtractor={(item, index) => `general${index}`}
          style={styles.flatList}
          listKey="general"
          nestedScrollEnabled
          scrollEnabled={false}
        />
        <View style={styles.listHeader}>
          <Text style={styles.title}>Messaging</Text>
        </View>
        <FlatList
          data={Messaging}
          renderItem={renderListItem}
          keyExtractor={(item, index) => `messaging${index}`}
          style={styles.flatList}
          listKey="Messaging"
          nestedScrollEnabled
          scrollEnabled={false}
        />
        <View style={styles.listHeader}>
          <Text style={styles.title}>Notifications Methods</Text>
        </View>
        <FlatList
          data={NotificationsMethods}
          renderItem={renderListItem}
          keyExtractor={(item, index) => `notificationsMethods${index}`}
          style={styles.flatList}
          listKey="NotificationsMethods"
          nestedScrollEnabled
          scrollEnabled={false}
        />
        <View style={styles.listHeader}>
          <Text style={styles.title}>Notify Me When</Text>
        </View>
        <FlatList
          data={Notifications}
          renderItem={renderListItem}
          keyExtractor={(item, index) => `notification${index}`}
          style={styles.flatList}
          listKey="Notifications"
          nestedScrollEnabled
          scrollEnabled={false}
        />
      </PAppContainer>
    </View>
  );
};

export default Preferences;

const styles = StyleSheet.create({
  headerTitle: {
    ...Body1Bold,
    color: WHITE,
  },
  title: {
    ...Body2Bold,
    color: WHITE,
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
  },
  leftItem: {
    marginRight: 10,
    flex: 1,
  },
  flatList: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: PRIMARYSOLID7,
  },
  listHeader: {
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
