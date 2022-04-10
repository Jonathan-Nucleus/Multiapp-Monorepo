import React from 'react';
import { View, StyleSheet } from 'react-native';

import RoundIcon from '../common/RoundIcon';

import LogoSvg from '../../assets/icons/logo.svg';
import SearchSvg from '../../assets/icons/search.svg';
import BellSvg from '../../assets/icons/bell.svg';

import { BGDARK } from 'shared/src/colors';

interface HeaderProps {
  containerStyle?: object;
  navigation: any;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { containerStyle, navigation } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <LogoSvg />
      <View style={styles.iconContainer}>
        <RoundIcon icon={<SearchSvg />} />
        <RoundIcon
          icon={<BellSvg />}
          onPress={() => navigation.navigate('Notification')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BGDARK,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
  },
  iconContainer: {
    flexDirection: 'row',
  },
});

export default Header;
