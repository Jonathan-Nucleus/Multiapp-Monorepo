import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';

import NotificationMethod from './NotificationMethod';
import Messages from './Messages';
import NotifyMe from './NotifyMe';
import { GRAY20, WHITE, GREEN, WHITE60 } from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';
import { Body1Bold, Body2, Body2Bold, Body3 } from 'mobile/src/theme/fonts';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import MainHeader from 'mobile/src/components/main/Header';
import { useUpdateSettings } from 'shared/graphql/mutation/account/useUpdateSettings';
import { useAccount } from 'shared/graphql/query/account';
import { SettingsInput } from 'backend/graphql/users.graphql';
import {
  NotificationEvent,
  NotificationMethod as NotificationMethodEnum,
} from 'backend/graphql/users.graphql';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

type NotificationProp = Record<
  NotificationEvent,
  { sms?: boolean; email?: boolean }
>;

interface NotificationMethodProp {
  [key: string]: boolean;
}

interface MessageTypeProp {
  [key: string]: boolean;
}

const Preferences: FC<RouterProps> = ({ navigation }) => {
  const { data: { account } = {} } = useAccount();
  const [updateSettings] = useUpdateSettings();
  const [tagging, setTagging] = useState(false);
  const [notifications, setNotifications] = useState<NotificationProp>({
    postCreate: {
      sms: true,
      email: false,
    },
    postLike: {
      sms: true,
      email: false,
    },
    postComment: {
      sms: false,
      email: false,
    },
    commentLike: {
      sms: false,
      email: false,
    },
    tagCreate: {
      sms: false,
      email: false,
    },
    messageReceived: {
      sms: false,
      email: false,
    },
  });
  const [notificationMethod, setNotificationMethod] =
    useState<NotificationMethodProp>({ enableEmail: true, enablePush: true });
  const [messageType, setMessageType] = useState<MessageTypeProp>({
    emailUnreadMessage: false,
    messaging: false,
  });

  const settings = account?.settings;

  useEffect(() => {
    if (settings) {
      setMessageType({
        emailUnreadMessage: settings.emailUnreadMessage,
        messaging: settings.messaging,
      });
      setTagging(settings.tagging);
      Object.keys(settings.notifications).forEach((key) => {
        const notification = settings.notifications[key];
        if (notification === 'BOTH') {
          notifications[key] = { sms: true, email: true };
        } else if (notification === 'SMS') {
          notifications[key] = { sms: true, email: false };
        } else if (notification === 'EMAIL') {
          notifications[key] = { sms: false, email: true };
        } else if (notification === 'NONE') {
          notifications[key] = { sms: false, email: false };
        }
      });
    }
  }, [settings]);

  const handleToggleMessageType = (val: boolean, key: string) => {
    setMessageType({
      ...messageType,
      [key]: val,
    });
  };

  const handleToggleNotificationMethod = (val: boolean, key: string) => {
    setNotificationMethod({
      ...notificationMethod,
      [key]: val,
    });
  };

  const handleToggleNotification = (
    val: boolean,
    key: NotificationEvent,
    type: 'sms' | 'email',
  ) => {
    let _notifications = { ...notifications };
    _notifications[key] = {
      ..._notifications[key],
      [type]: val,
    };
    setNotifications(_notifications);
  };

  useEffect(() => {
    const selectedNotifications = {} as Record<
      NotificationEvent,
      NotificationMethodEnum
    >;

    Object.keys(notifications).forEach((key: NotificationEvent) => {
      const notification = notifications[key];
      if (notification.sms && notification.email) {
        selectedNotifications[key] = 'BOTH';
      } else if (notification.sms) {
        selectedNotifications[key] = 'SMS';
      } else if (notification.email) {
        selectedNotifications[key] = 'EMAIL';
      } else {
        selectedNotifications[key] = 'NONE';
      }
    });
    const settingsInput: SettingsInput = {
      tagging: tagging,
      interests: account?.settings?.interests ?? [],
      notifications: selectedNotifications,
      messaging: messageType.messaging,
      emailUnreadMessage: messageType.emailUnreadMessage,
    };
    onSubmit(settingsInput);
  }, [tagging, notifications, messageType, notificationMethod]);

  const onSubmit = async (settingsInput: SettingsInput) => {
    try {
      await updateSettings({ variables: { settings: settingsInput } });
    } catch (e) {
      console.log('setting component err', e);
    }
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
        <View style={styles.item}>
          <View style={styles.leftItem}>
            <Text style={styles.label}>Allow tagging</Text>
            <Text style={styles.comment}>
              If allowed, users my tag you in posts, comments and messages using
              the @mention feature.
            </Text>
          </View>
          <Switch
            trackColor={{ false: GRAY20, true: GREEN }}
            ios_backgroundColor={GRAY20}
            onValueChange={setTagging}
            value={tagging}
          />
        </View>
        <Messages
          handleToggleMessageType={handleToggleMessageType}
          messageType={messageType}
        />
        <NotificationMethod
          handleToggleNotificationMethod={handleToggleNotificationMethod}
          notificationMethod={notificationMethod}
        />
        <NotifyMe
          handleToggleNotification={handleToggleNotification}
          notifications={notifications}
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
    color: WHITE60,
    ...Body3,
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 36,
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
});
