import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';
import LinearGradient from 'react-native-linear-gradient';

import { Body2 } from '../../theme/fonts';
import { WHITE, DISABLED, DISABLEDTXT } from 'shared/src/colors';

const PGradientButton = (props) => {
  const {
    btnContainer,
    textStyle,
    label,
    onPress,
    disabled = false,
    isLoading = false,
  } = props;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || isLoading}>
      <LinearGradient
        colors={disabled ? ['#FFFFFF61', '#FFFFFF61'] : ['#844AFF', '#00AAE0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, btnContainer]}>
        {isLoading ? (
          <UIActivityIndicator color={WHITE} size={24} />
        ) : (
          <Text
            style={[
              styles.textStyle,
              textStyle,
              disabled && styles.disabledLabel,
            ]}>
            {label}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PGradientButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 32,
    height: 40,
  },
  disabled: {
    backgroundColor: 'red',
  },
  disabledLabel: {
    color: DISABLEDTXT,
  },
  textStyle: {
    color: WHITE,
    ...Body2,
    textTransform: 'uppercase',
  },
});
