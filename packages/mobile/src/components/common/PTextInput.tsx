import React, { LegacyRef, useState, forwardRef, ReactElement } from 'react';
import {
  View,
  ViewStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  Text,
} from 'react-native';

import PFormLabel from './PFormLabel';
import { Body1, Body2, Body3 } from '../../theme/fonts';
import { WHITE, BLACK, GRAY800, DANGER, BLACK75 } from 'shared/src/colors';

export interface PTextInputProps extends TextInputProps {
  label: string;
  text: string;
  icon?: ReactElement | null;
  numberOfLines?: number;
  onPress?: () => void;
  onPressText?: () => void;
  error?: string;
  showError?: boolean;
  errorStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelTextStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<ViewStyle>;
  subLabel?: string;
  subLabelTextStyle?: StyleProp<TextStyle>;
  subLabelStyle?: StyleProp<ViewStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
}

const PTextInput = forwardRef<TextInput, PTextInputProps>((props, ref) => {
  const {
    containerStyle,
    label,
    labelStyle,
    labelTextStyle,
    text,
    textInputStyle,
    textContainerStyle,
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
    error,
    showError = true,
    errorStyle,
    numberOfLines = 1,
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
      <View
        style={[
          styles.view,
          textContainerStyle,
          !!error && styles.errorInput,
          isFocused && styles.focused,
        ]}>
        <TextInput
          ref={ref as LegacyRef<TextInput>}
          {...textInputProps}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          onChangeText={handleOnChangeText}
          secureTextEntry={secureTextEntry}
          style={[styles.textInput, textInputStyle]}
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
          numberOfLines={numberOfLines}
          keyboardAppearance="dark"
        />
        {children}
        {!!icon && (
          <TouchableOpacity onPress={onPress}>
            <View style={styles.icon}>{icon}</View>
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.error, errorStyle]}>
        {error && showError ? error : null}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  textInput: {
    ...Body1,
    color: WHITE,
    paddingTop: 0,
    textAlignVertical: 'top',
    flex: 1,
    flexGrow: 1,
  },
  errorInput: {
    borderColor: DANGER,
  },
  focused: {
    borderColor: WHITE,
  },
  defaultLabelText: {
    ...Body2,
    color: WHITE,
    fontWeight: '700',
  },
  container: {},
  view: {
    flexDirection: 'row',
    minHeight: 48,
    maxHeight: 140,
    borderColor: GRAY800,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: BLACK75,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    elevation: 1,
    shadowColor: BLACK,
    shadowOpacity: 0.25,
    marginBottom: 4,
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    right: 0,
    top: -12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  error: {
    color: DANGER,
    ...Body3,
    marginBottom: 10,
    height: 12,
  },
});

export default PTextInput;
