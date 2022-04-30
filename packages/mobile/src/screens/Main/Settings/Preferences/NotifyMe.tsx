import React, { FC, useState } from 'react';
import {
  ListRenderItem,
  StyleSheet,
  FlatList,
  View,
  Text,
  Switch,
} from 'react-native';
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
  WHITE60,
  WHITE12,
} from 'shared/src/colors';

import PHeader from 'mobile/src/components/common/PHeader';
import pStyles from 'mobile/src/theme/pStyles';
import {
  Body1,
  Body1Bold,
  Body2,
  Body2Bold,
  Body3,
} from 'mobile/src/theme/fonts';

interface NotificationSetting {
  label1: string;
  toggleSwitch?: () => void;
  isEnabled?: boolean;
  id: string;
  value: boolean;
}

interface SelectedNotification {
  id: string;
  value: boolean;
}

const Notifications = [
  {
    label1: 'New post from people or companies you’re following',
    value: true,
    id: 'new',
  },
  {
    label1: 'Likes on your posts',
    value: true,
    id: 'like',
  },
  {
    label1: 'Comments on you rposts',
    value: true,
    id: 'comment',
  },
  {
    label1: 'Tagged in a post, comment or profile page',
    value: true,
    id: 'tag',
  },
  {
    label1: 'New Messages',
    value: true,
    id: 'message',
  },
];

const NotifyMe: React.FC = () => {
  const [enabledList, setEnabledList] = useState<SelectedNotification[]>([]);

  const handleToggleSelect = (val: boolean, item: NotificationSetting) => {
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

  const renderListItem: ListRenderItem<NotificationSetting> = ({ item }) => {
    return (
      <View>
        <Text style={styles.title}>{item.label1}</Text>
        <View style={styles.item}>
          <View style={styles.row}>
            <Switch
              trackColor={{ false: GRAY20, true: GREEN }}
              ios_backgroundColor={GRAY20}
              onValueChange={(selected) => handleToggleSelect(selected, item)}
              value={
                enabledList.findIndex((v) => v.id === item.id && v.value) > -1
              }
            />
            <View style={styles.rightItem}>
              <Text style={styles.title}>Mobile Push</Text>
            </View>
          </View>
          <View style={[styles.row]}>
            <View style={styles.circle} />
            <View style={styles.rightItem}>
              <Text style={[styles.title, styles.email]}>Email</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.listHeader}>
        <Text style={styles.headerTitle}>Notify Me When</Text>
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
    </>
  );
};

export default NotifyMe;

const styles = StyleSheet.create({
  headerTitle: {
    ...Body1Bold,
    color: WHITE,
  },
  title: {
    ...Body2Bold,
    color: WHITE,
  },
  email: {
    color: WHITE60,
  },
  label: {
    ...Body2,
    color: WHITE,
  },
  comment: {
    color: WHITE60,
    ...Body3,
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: WHITE12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  rightItem: {
    marginLeft: 10,
  },
  flatList: {
    flex: 1,
    borderRadius: 8,
  },
  listHeader: {
    marginTop: 24,
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: WHITE60,
  },
});
