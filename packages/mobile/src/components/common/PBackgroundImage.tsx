import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

import BackgroundImg from '../../assets/onboarding-bg.png';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

const PBackgroundImage: React.FC = ({ children }) => {
  return (
    <View style={styles.container}>
      <FastImage
        source={BackgroundImg}
        style={styles.bgContainer}
        resizeMode="cover">
        <View style={styles.content}>{children}</View>
      </FastImage>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default PBackgroundImage;
