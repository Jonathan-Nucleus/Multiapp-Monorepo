import React, { forwardRef, LegacyRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { Body2 } from '../../theme/fonts';
import { WHITE, GRAY700, GRAY600 } from 'shared/src/colors';

interface ExpandingInputProps extends Omit<TextInputProps, 'multiline'> {
  containerStyle?: StyleProp<ViewStyle>;
  viewAbove?: React.ReactNode;
  viewLeft?: React.ReactNode;
  viewRight?: React.ReactNode;
}

const ExpandingInput = forwardRef<TextInput, ExpandingInputProps>(
  (props, ref) => {
    const { containerStyle, viewAbove, viewLeft, viewRight, ...inputProps } =
      props;

    return (
      <View style={[styles.container, containerStyle]}>
        {viewLeft ? viewLeft : null}
        <View style={styles.flex}>
          {viewAbove}
          <TextInput
            {...inputProps}
            ref={ref as LegacyRef<TextInput>}
            style={[styles.textInput]}
            placeholderTextColor={GRAY600}
            multiline={true}
            keyboardAppearance="dark"
          />
        </View>
        {viewRight ? viewRight : null}
      </View>
    );
  },
);

export default ExpandingInput;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GRAY700,
    borderRadius: 16,
    minHeight: 40,
    maxHeight: 140,
    paddingVertical: 8,
  },
  textInput: {
    marginTop: -8,
    color: WHITE,
    padding: 0,
    textAlignVertical: 'top',
    ...Body2,
    lineHeight: 20,
  },
  error: {
    height: 0,
    marginBottom: 0,
  },
});
