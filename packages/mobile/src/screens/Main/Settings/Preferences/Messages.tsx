import React from 'react';
import {
  ListRenderItem,
  StyleSheet,
  FlatList,
  View,
  Text,
  Switch,
} from 'react-native';

import { GRAY20, WHITE, GREEN, WHITE60, WHITE12 } from 'shared/src/colors';
import { Body1Bold, Body2, Body2Bold, Body3 } from 'mobile/src/theme/fonts';

const MessagingSettings = [
  {
    label: 'Allow Messages',
    info: 'If allowed, users may message you within Prometheus Alts',
    key: 'messaging',
  },
  {
    label: 'Receive messages by email',
    key: 'emailUnreadMessage',
  },
];

interface MessagingSetting {
  label: string;
  info?: string;
  key: string;
}

interface MessageTypeProp {
  [key: string]: boolean;
}
interface NotificationMethodProps {
  handleToggleMessageType: (val: boolean, key: string) => void;
  messageType: MessageTypeProp;
}

const Messages: React.FC<NotificationMethodProps> = ({
  handleToggleMessageType,
  messageType,
}) => {
  const renderListItem: ListRenderItem<MessagingSetting> = ({ item }) => {
    return (
      <View style={[styles.item, item.key === 'message' && styles.border]}>
        <View style={styles.leftItem}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.comment}>{item.info}</Text>
        </View>
        <Switch
          trackColor={{ false: GRAY20, true: GREEN }}
          ios_backgroundColor={GRAY20}
          onValueChange={(val) => handleToggleMessageType(val, item.key)}
          value={messageType?.[item.key]}
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
        keyExtractor={(item) => item.key}
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
