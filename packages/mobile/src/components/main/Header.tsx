import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import Avatar from '../common/Avatar';
import PHeader from '../common/PHeader';
import PLabel from '../common/PLabel';
import * as NavigationService from '../../services/navigation/NavigationService';

import LogoSvg from 'shared/assets/images/logo-icon.svg';
import SearchSvg from 'shared/assets/images/search.svg';
import BellSvg from 'shared/assets/images/bell.svg';
import { H6 } from '../../theme/fonts';
import { useAccount } from 'shared/graphql/query/account/useAccount';

interface HeaderProps {
  containerStyle?: ViewStyle;
  outerContainerStyle?: ViewStyle;
  rightIcon?: any;
  leftIcon?: any;
  centerIcon?: any;
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
  const { data: { account } = {} } = useAccount();

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
            <TouchableOpacity
              onPress={() => NavigationService.navigate('Search')}>
              <SearchSvg />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => NavigationService.navigate('Notification')}>
              <BellSvg style={styles.headerIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                NavigationService.navigate('UserDetails', {
                  screen: 'UserProfile',
                  params: {
                    userId: account?._id,
                  },
                })
              }>
              <Avatar user={account} size={32} />
            </TouchableOpacity>
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
