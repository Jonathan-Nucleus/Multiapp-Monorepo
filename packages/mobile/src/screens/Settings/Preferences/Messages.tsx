import React, { useState } from 'react';
import {
  ListRenderItem,
  StyleSheet,
  FlatList,
  View,
  Text,
  Switch,
} from 'react-native';

import { GRAY20, WHITE, GREEN, WHITE60, WHITE12 } from 'shared/src/colors';

import { Body1Bold, Body2, Body2Bold, Body3 } from '../../../theme/fonts';

interface MessagingSetting {
  label1: string;
  label2?: string;
  toggleSwitch?: () => void;
  isEnabled?: boolean;
  id: string;
  value: boolean;
}

interface SelectedMessagingSetting {
  id: string;
  value: boolean;
}

const MessagingSettings = [
  {
    label1: 'Allow Messages',
    label2: 'If allowed, users may message you within Prometheus Alts',
    value: false,
    id: 'message',
  },
  {
    label1: 'Receive messages by email',
    value: false,
    id: 'email',
  },
];

const Messages: React.FC = () => {
  const [enabledList, setEnabledList] = useState<SelectedMessagingSetting[]>(
    [],
  );

  const handleToggleSelect = (val: boolean, item: MessagingSetting) => {
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

  const renderListItem: ListRenderItem<MessagingSetting> = ({ item }) => {
    return (
      <View style={[styles.item, item.id === 'message' && styles.border]}>
        <View style={styles.leftItem}>
          <Text style={styles.label}>{item.label1}</Text>
          <Text style={styles.comment}>{item.label2}</Text>
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
        <Text style={styles.title}>Messaging</Text>
      </View>
      <FlatList
        data={MessagingSettings}
        renderItem={renderListItem}
        keyExtractor={(item, index) => `messaging${index}`}
        style={styles.flatList}
        listKey="Messaging"
        nestedScrollEnabled
        scrollEnabled={false}
      />
    </>
  );
};

export default Messages;

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
  border: {
    borderBottomWidth: 1,
    borderBottomColor: WHITE12,
    paddingBottom: 16,
  },
});
