import React from 'react';
import { View, StyleSheet } from 'react-native';
import BGSvg from '../../assets/images/bg.svg';

const PBackgroundImage: React.FC = ({ children }) => {
  return (
    <View style={styles.container}>
      <BGSvg />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
