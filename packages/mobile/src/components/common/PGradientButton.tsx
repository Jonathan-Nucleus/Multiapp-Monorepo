import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';
import LinearGradient from 'react-native-linear-gradient';

import { Body2 } from '../../theme/fonts';
import { WHITE, DISABLED, DISABLEDTXT } from 'shared/src/colors';

interface ButtonProps {
  btnContainer?: ViewStyle;
  gradientContainer?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const PGradientButton: React.FC<ButtonProps> = (props) => {
  const {
    btnContainer,
    gradientContainer,
    textStyle,
    label,
    icon,
    onPress,
    disabled = false,
    isLoading = false,
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={btnContainer}>
      <LinearGradient
        colors={disabled ? ['#FFFFFF61', '#FFFFFF61'] : ['#844AFF', '#00AAE0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, gradientContainer]}>
        {isLoading ? (
          <UIActivityIndicator color={WHITE} size={24} />
        ) : (
          <>
            {label && (
              <Text
                allowFontScaling={false}
                style={[
                  styles.textStyle,
                  textStyle,
                  disabled && styles.disabledLabel,
                ]}>
                {label}
              </Text>
            )}
            {icon}
          </>
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
  disabledLabel: {
    color: DISABLEDTXT,
  },
  textStyle: {
    color: WHITE,
    ...Body2,
    textTransform: 'capitalize',
  },
});
