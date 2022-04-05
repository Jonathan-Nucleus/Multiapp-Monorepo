import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { WHITE } from 'shared/src/colors';

const PAppContainer = (props) => {
  const { children, style, flatList } = props;

  if (flatList) {
    return <View style={[styles.container, style]}>{children}</View>;
  }

  return (
    <KeyboardAwareScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, style]}>{children}</View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default PAppContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
  },
});
