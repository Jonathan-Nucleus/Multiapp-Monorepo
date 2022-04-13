import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import RoundImageView from '../common/RoundImageView';
import PHeader from '../common/PHeader';
import PLabel from '../common/PLabel';
import * as NavigationService from '../../services/navigation/NavigationService';

import Avatar from '../../assets/avatar.png';
import LogoSvg from 'shared/assets/images/logo-icon.svg';
import SearchSvg from 'shared/assets/images/search.svg';
import BellSvg from 'shared/assets/images/bell.svg';
import { BGDARK, BGHEADER } from 'shared/src/colors';
import { H6 } from '../../theme/fonts';

interface HeaderProps {
  containerStyle?: object;
  rightIcon?: any;
  leftIcon?: any;
  centerIcon?: any;
  onPressLeft?: () => void;
}

const MainHeader: React.FC<HeaderProps> = (props) => {
  const { containerStyle, leftIcon, rightIcon, centerIcon, onPressLeft } =
    props;

  return (
    <PHeader
      leftIcon={
        leftIcon ? (
          leftIcon
        ) : (
          <View style={[styles.headerLogoContainer, containerStyle]}>
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
            <SearchSvg />
            <TouchableOpacity
              onPress={() => NavigationService.navigate('Notification')}>
              <BellSvg style={styles.headerIcon} />
            </TouchableOpacity>
            <RoundImageView image={Avatar} imageStyle={styles.avatarImage} />
          </View>
        )
      }
      centerIcon={centerIcon}
      containerStyle={styles.headerContainer}
      onPressLeft={onPressLeft}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: BGHEADER,
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
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default MainHeader;
