import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Pressable,
  Text,
  StyleProp,
} from 'react-native';

import Avatar from '../common/Avatar';
import PHeader from '../common/PHeader';
import PLabel from '../common/PLabel';
import * as NavigationService from '../../services/navigation/NavigationService';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE } from 'shared/src/colors';

import LogoSvg from 'shared/assets/images/logo-icon.svg';
import SearchSvg from 'shared/assets/images/search.svg';
import BellSvg from 'shared/assets/images/bell.svg';
import { H6, Body3 } from '../../theme/fonts';

import { useAccountContext } from 'shared/context/Account';
import { useNotificationsContext } from 'shared/context/Notifications';

interface HeaderProps {
  containerStyle?: StyleProp<ViewStyle>;
  outerContainerStyle?: StyleProp<ViewStyle>;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  centerIcon?: React.ReactNode;
  onPressLeft?: () => void;
}

const MainHeader: React.FC<HeaderProps> = (props) => {
  const {
    containerStyle,
    outerContainerStyle,
    leftIcon,
    rightIcon,
    centerIcon,
    onPressLeft,
  } = props;
  const account = useAccountContext();
  const { notifications } = useNotificationsContext();

  const newNotificationCount = notifications.filter(
    (notification) => notification.isNew,
  ).length;

  return (
    <PHeader
      leftIcon={
        leftIcon ? (
          leftIcon
        ) : (
          <View style={styles.headerLogoContainer}>
            <LogoSvg />
            <PLabel
              label="Prometheus"
              textStyle={styles.logoText}
              viewStyle={styles.logoTextWrapper}
            />
          </View>
        )
      }
      rightIcon={
        rightIcon ? (
          rightIcon
        ) : (
          <View style={styles.headerIconContainer}>
            <Pressable
              style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}
              onPress={() => NavigationService.navigate('Search')}>
              <SearchSvg />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.notifications,
                pressed ? pStyles.pressedStyle : null,
              ]}
              onPress={() => NavigationService.navigate('Notification')}>
              <BellSvg style={styles.headerIcon} />
              {newNotificationCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{newNotificationCount}</Text>
                </View>
              ) : null}
            </Pressable>
            <Pressable
              style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}
              onPress={() =>
                NavigationService.navigate('UserDetails', {
                  screen: 'UserProfile',
                  params: {
                    userId: account._id,
                  },
                })
              }>
              <Avatar user={account} size={32} />
            </Pressable>
          </View>
        )
      }
      centerIcon={centerIcon}
      outerContainerStyle={outerContainerStyle}
      containerStyle={[styles.headerContainer, containerStyle]}
      onPressLeft={onPressLeft}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'space-between',
  },
  headerLogoContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  logoTextWrapper: {
    marginLeft: 8,
  },
  logoText: {
    ...H6,
  },
  notifications: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: 'red',
    paddingHorizontal: 4,
    borderRadius: 8,
    padding: 2,
    height: 16,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: WHITE,
    lineHeight: 16,
    ...Body3,
  },
  headerIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    marginHorizontal: 20,
  },
});

export default MainHeader;
