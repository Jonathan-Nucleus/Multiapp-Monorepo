import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { BGDARK } from 'shared/src/colors';
import SplashImage from '../../assets/splash.png';

const Splash: React.FC = () => (
  <View style={[styles.splashView]}>
    <Image source={SplashImage} />
  </View>
);

export default Splash;

const styles = StyleSheet.create({
  splashView: {
    backgroundColor: BGDARK,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
