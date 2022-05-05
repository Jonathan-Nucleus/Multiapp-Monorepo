import React from 'react';
import { View, StyleSheet } from 'react-native';

import LoadingSvg from '../../assets/icons/loading.svg';

interface LoadingProps {
  show: boolean;
}

const Loading: React.FC<LoadingProps> = ({ show }) => {
  if (!show) {
    return null;
  }
  return (
    <View style={styles.container}>
      <LoadingSvg width={50} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
