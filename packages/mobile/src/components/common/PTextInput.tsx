import React, { useEffect, useState } from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  TextStyle,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import PFormLabel from './PFormLabel';
import { Body1, Body2 } from '../../theme/fonts';
import { WHITE, PRIMARY, BLACK, GRAY800, GRAY700 } from 'shared/src/colors';

interface PTextInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  label: string;
  labelTextStyle?: TextStyle;
  labelStyle?: ViewStyle;
  subLabel?: string;
  subLabelTextStyle?: TextStyle;
  subLabelStyle?: ViewStyle;
  text: string;
  textInputStyle?: ViewStyle;
  onPress?: () => void;
  onPressText?: () => void;
  icon?: string;
}

const PTextInput: React.FC<PTextInputProps> = (props) => {
  const {
    containerStyle,
    label,
    labelStyle,
    labelTextStyle,
    text,
    textInputStyle,
    subLabel,
    subLabelStyle,
    subLabelTextStyle,
    onChangeText,
    onPressText,
    onPress,
    onFocus,
    onBlur,
    onSubmitEditing,
    icon,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    editable = true,
    autoCapitalize = 'none',
    autoFocus = false,
    children,
    placeholderTextColor = '#888',
    multiline = false,
    autoCorrect = true,
    ...textInputProps
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const handleOnChangeText = (val: string): void => {
    onChangeText?.(val);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.row}>
        <PFormLabel
          label={label}
          style={labelStyle}
          textStyle={[styles.defaultLabelText, labelTextStyle]}
        />
        <PFormLabel
          label={subLabel ?? ''}
          style={subLabelStyle}
          textStyle={subLabelTextStyle}
          onPress={onPressText}
        />
      </View>
      <View style={styles.view}>
        <TextInput
          {...textInputProps}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          onChangeText={handleOnChangeText}
          secureTextEntry={secureTextEntry}
          style={[
            styles.textInput,
            textInputStyle,
            isFocused && styles.focused,
          ]}
          value={text}
          keyboardType={keyboardType}
          editable={editable}
          autoCapitalize={autoCapitalize}
          onSubmitEditing={onSubmitEditing}
          onFocus={(evt) => {
            onFocus?.(evt);
            setIsFocused(true);
          }}
          onBlur={(evt) => {
            onBlur?.(evt);
            setIsFocused(false);
          }}
          autoFocus={autoFocus}
          multiline={multiline}
          autoCorrect={autoCorrect}
        />
        {children}
        {!!icon && (
          <TouchableOpacity onPress={onPress}>
            <View style={styles.icon}>{icon}</View>
          </TouchableOpacity>
        )}
      </View>
      {/* {!!error && <ErrorText error={error} errorStyle={errorStyle} />} */}
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    ...Body1,
    color: WHITE,
    height: 43,
    borderColor: GRAY800,
    borderWidth: 1,
    borderRadius: 8,
    paddingBottom: 5,
    paddingTop: 7,
    paddingHorizontal: 8,
    backgroundColor: GRAY700,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    elevation: 1,
    shadowColor: BLACK,
    shadowOpacity: 0.25,
    marginBottom: 20,
  },
  focused: {
    borderColor: PRIMARY,
  },
  defaultLabelText: {
    ...Body2,
    color: WHITE,
    fontWeight: '700',
  },
  container: {},
  view: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PTextInput;
