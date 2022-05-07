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
import { NotificationEventOptions } from 'backend/schemas/user';
import { NotificationEvent } from 'backend/graphql/users.graphql';

interface NotificationSetting {
  info?: string | undefined;
  key: NotificationEvent;
  label: string;
}

type NotificationProp = Record<
  NotificationEvent,
  { sms?: boolean; email?: boolean }
>;

interface NotifyMeProps {
  handleToggleNotification: (
    val: boolean,
    key: NotificationEvent,
    type: 'sms' | 'email',
  ) => void;
  notifications: NotificationProp;
}

const Notifications = Object.keys(NotificationEventOptions).map((key) => {
  return {
    key,
    ...NotificationEventOptions[key],
  };
});

const NotifyMe: React.FC<NotifyMeProps> = ({
  handleToggleNotification,
  notifications,
}) => {
  const renderListItem: ListRenderItem<NotificationSetting> = ({ item }) => {
    return (
      <View>
        <Text style={styles.title}>{item.label}</Text>
        <View style={styles.item}>
          <View style={styles.row}>
            <Switch
              trackColor={{ false: GRAY20, true: GREEN }}
              ios_backgroundColor={GRAY20}
              onValueChange={(selected) =>
                handleToggleNotification(selected, item.key, 'sms')
              }
              value={notifications?.[item.key]?.['sms']}
            />
            <View style={styles.rightItem}>
              <Text style={styles.title}>Mobile Push</Text>
            </View>
          </View>
          <View style={[styles.row]}>
            <Switch
              trackColor={{ false: GRAY20, true: GREEN }}
              ios_backgroundColor={GRAY20}
              onValueChange={(selected) =>
                handleToggleNotification(selected, item.key, 'email')
              }
              value={notifications?.[item.key]?.['email']}
            />
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
