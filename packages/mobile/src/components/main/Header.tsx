import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import Avatar from '../common/Avatar';
import PHeader from '../common/PHeader';
import PLabel from '../common/PLabel';
import * as NavigationService from '../../services/navigation/NavigationService';

import LogoSvg from 'shared/assets/images/logo-icon.svg';
import SearchSvg from 'shared/assets/images/search.svg';
import BellSvg from 'shared/assets/images/bell.svg';
import { GRAY900 } from 'shared/src/colors';
import { H6 } from '../../theme/fonts';
import { useAccount } from '../../graphql/query/account';

import { AVATAR_URL } from 'react-native-dotenv';

interface HeaderProps {
  containerStyle?: ViewStyle;
  rightIcon?: any;
  leftIcon?: any;
  centerIcon?: any;
  onPressLeft?: () => void;
}

const MainHeader: React.FC<HeaderProps> = (props) => {
  const { containerStyle, leftIcon, rightIcon, centerIcon, onPressLeft } =
    props;

  const { data } = useAccount();

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
                    userId: data?.account._id,
                  },
                })
              }>
              <Avatar user={data?.account} size={32} />
            </TouchableOpacity>
          </View>
        )
      }
      centerIcon={centerIcon}
      containerStyle={[styles.headerContainer, containerStyle]}
      onPressLeft={onPressLeft}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: GRAY900,
    marginBottom: 4,
  },
  headerLogoContainer: {
    flexDirection: 'row',
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
