import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import PFormLabel from './PFormLabel';
import { Body2, Body1 } from '../../theme/fonts';
import { WHITE, PRIMARY, BLACK } from 'shared/src/colors';

const PTextInput = (props) => {
  const {
    onChangeText,
    secureTextEntry = false,
    containerStyle,
    labelStyle,
    labelTextStyle,
    textInputStyle,
    label,
    subLabel,
    text,
    error,
    errorStyle,
    keyboardType = 'default',
    editable = true,
    onPress,
    icon,
    placeholder,
    autoCapitalize = 'none',
    onSubmitEditing,
    onFocus,
    onBlur,
    autoFocus = false,
    children,
    placeholderTextColor = '#888',
    multiline = false,
    autoCorrect = true,
    subLabelStyle,
    subLabelTextStyle,
    onPressText,
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [borderColor, setBorderColor] = useState({
    borderColor: WHITE,
  });

  useEffect(() => {
    if (isFocused) {
      setBorderColor({
        borderColor: PRIMARY,
      });
    } else {
      setBorderColor({
        borderColor: WHITE,
      });
    }
  }, [isFocused]);

  const handleOnChangeText = (val) => {
    onChangeText(val);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.row}>
        <PFormLabel
          label={label}
          style={labelStyle}
          textStyle={labelTextStyle}
        />
        <PFormLabel
          label={subLabel}
          style={subLabelStyle}
          textStyle={subLabelTextStyle}
          onPress={onPressText}
        />
      </View>
      <View style={styles.view}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          onChangeText={handleOnChangeText}
          secureTextEntry={secureTextEntry}
          style={[styles.textInput, textInputStyle, borderColor]}
          value={text}
          keyboardType={keyboardType}
          editable={editable}
          autoCapitalize={autoCapitalize}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => {
            onFocus && onFocus();
            setIsFocused(true);
          }}
          onBlur={() => {
            onBlur && onBlur();
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
    color: Body2,
    height: 36,
    borderColor: PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    paddingBottom: 5,
    paddingTop: 7,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
