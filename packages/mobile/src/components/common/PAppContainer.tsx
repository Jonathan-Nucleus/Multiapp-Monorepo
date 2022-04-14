import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BLACK } from 'shared/src/colors';

interface AppContainerProps {
  style?: ViewStyle;
  flatList?: boolean;
  children: any;
}

const PAppContainer: React.FC<AppContainerProps> = (props) => {
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
    paddingHorizontal: 16,
    backgroundColor: BLACK,
  },
});
