import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BGDARK } from 'shared/src/colors';

const Managers = () => {
  return <View style={styles.container}></View>;
};

export default Managers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGDARK,
  },
});
