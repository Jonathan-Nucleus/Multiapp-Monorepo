import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Text, Switch } from 'react-native';

import { GRAY20, WHITE, GREEN, WHITE60, WHITE12 } from 'shared/src/colors';

import { Body1Bold, Body2, Body2Bold, Body3 } from '../../../theme/fonts';
import PhoneSvg from '../../../assets/icons/phone.svg';
import EmailSvg from '../../../assets/icons/email.svg';

interface renderItemProps {
  item: {
    label1: string;
    label2?: string;
    toggleSwitch?: () => void;
    isEnabled?: boolean;
    id: string;
    value: boolean;
    icon: string;
  };
}

interface selectedItemProps {
  id: string;
  value: boolean;
}

const NotificationsMethods = [
  {
    icon: <PhoneSvg />,
    label1: 'Mobile Push',
    value: false,
    id: 'phone',
  },
  {
    icon: <EmailSvg />,
    label1: 'Email',
    value: false,
    id: 'email',
  },
];

const NotificationMethod: React.FC = () => {
  const [enabledList, setEnabledList] = useState<selectedItemProps[]>([]);

  const handleToggleSelect = (val: boolean, item: renderItemProps) => {
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

  const renderListNotificationItem = ({ item }: renderItemProps) => {
    return (
      <View
        style={[
          styles.item,
          styles.notificationContainer,
          item.id === 'phone' && styles.border,
        ]}>
        {item.icon}
        <View style={[styles.leftItem, styles.notificationItem]}>
          <Text style={styles.label}>{item.label1}</Text>
        </View>
        <Switch
          trackColor={{ false: GRAY20, true: GREEN }}
          ios_backgroundColor={GRAY20}
          onValueChange={(val) => handleToggleSelect(val, item)}
          value={enabledList.findIndex((v) => v.id === item.id && v.value) > -1}
        />
      </View>
    );
  };

  return (
    <>
      <View style={styles.listHeader}>
        <Text style={styles.title}>Notifications Methods</Text>
      </View>
      <FlatList
        data={NotificationsMethods}
        renderItem={renderListNotificationItem}
        keyExtractor={(item, index) => `notificationsMethods${index}`}
        style={styles.flatList}
        listKey="NotificationsMethods"
        nestedScrollEnabled
        scrollEnabled={false}
      />
    </>
  );
};

export default NotificationMethod;

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
    color: WHITE60,
    ...Body3,
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  leftItem: {
    marginRight: 10,
    flex: 1,
  },
  flatList: {
    flex: 1,
    borderRadius: 8,
  },
  listHeader: {
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationItem: {
    marginLeft: 12,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: WHITE12,
    paddingBottom: 16,
  },
});
