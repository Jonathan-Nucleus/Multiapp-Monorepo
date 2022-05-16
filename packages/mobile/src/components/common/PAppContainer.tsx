import React, { LegacyRef, PropsWithChildren, forwardRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BLACK, BGDARK } from 'shared/src/colors';

interface AppContainerProps extends PropsWithChildren<unknown> {
  modal?: boolean;
  style?: StyleProp<ViewStyle>;
  noScroll?: boolean;
  disableKeyboardScroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const PAppContainer = forwardRef<KeyboardAwareScrollView, AppContainerProps>(
  (props, ref) => {
    const {
      children,
      style,
      noScroll,
      contentContainerStyle,
      disableKeyboardScroll = false,
      modal = false,
    } = props;

    const content = (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, modal ? styles.modal : null, style]}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    );

    return noScroll ? (
      content
    ) : (
      <KeyboardAwareScrollView
        ref={ref as LegacyRef<KeyboardAwareScrollView>}
        contentContainerStyle={contentContainerStyle}
        enableAutomaticScroll={!disableKeyboardScroll}>
        {content}
      </KeyboardAwareScrollView>
    );
  },
);

export default PAppContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    backgroundColor: BLACK,
  },
  modal: {
    backgroundColor: BGDARK,
  },
});
