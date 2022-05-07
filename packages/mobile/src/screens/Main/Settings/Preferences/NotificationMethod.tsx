import React, { ReactElement } from 'react';
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
import PhoneSvg from 'mobile/src/assets/icons/phone.svg';
import EmailSvg from 'mobile/src/assets/icons/email.svg';

const NotificationMethods = [
  {
    icon: <PhoneSvg />,
    label: 'Mobile Push',
    key: 'enablePush',
  },
  {
    icon: <EmailSvg />,
    label: 'Email',
    key: 'enableEmail',
  },
];

interface NotificationMethod {
  label: string;
  key: string;
  icon: ReactElement;
}

interface NotificationProp {
  [key: string]: boolean;
}
interface NotificationMethodProps {
  handleToggleNotificationMethod: (val: boolean, key: string) => void;
  notificationMethod: NotificationProp;
}

const NotificationMethodChooser: React.FC<NotificationMethodProps> = ({
  handleToggleNotificationMethod,
  notificationMethod,
}) => {
  const renderListNotificationItem: ListRenderItem<NotificationMethod> = ({
    item,
  }) => {
    return (
      <View
        style={[
          styles.item,
          styles.notificationContainer,
          item.key === 'enablePush' && styles.border,
        ]}>
        {item.icon}
        <View style={[styles.leftItem, styles.notificationItem]}>
          <Text style={styles.label}>{item.label}</Text>
        </View>
        <Switch
          trackColor={{ false: GRAY20, true: GREEN }}
          ios_backgroundColor={GRAY20}
          onValueChange={(val) => handleToggleNotificationMethod(val, item.key)}
          value={notificationMethod?.[item.key]}
        />
      </View>
    );
  };

  return (
    <>
      <View style={styles.listHeader}>
        <Text style={styles.title}>Notification Methods</Text>
      </View>
      <FlatList
        data={NotificationMethods}
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

export default NotificationMethodChooser;

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
