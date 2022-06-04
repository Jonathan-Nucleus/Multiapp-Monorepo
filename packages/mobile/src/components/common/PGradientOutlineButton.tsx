import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';
import LinearGradient from 'react-native-linear-gradient';

import { Body2 } from '../../theme/fonts';
import { WHITE, DISABLEDTXT, BLACK } from 'shared/src/colors';

interface ButtonProps {
  btnContainer?: StyleProp<ViewStyle>;
  gradientContainer?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const PGradientOutlineButton: React.FC<ButtonProps> = (props) => {
  const {
    btnContainer,
    gradientContainer,
    textStyle,
    label,
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
          <View style={styles.txtWrap}>
            <Text
              allowFontScaling={false}
              style={[
                styles.textStyle,
                textStyle,
                disabled && styles.disabledLabel,
              ]}>
              {label}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PGradientOutlineButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 0,
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
    textTransform: 'capitalize',
  },
  txtWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '99%',
    paddingVertical: 0,
    borderRadius: 80,
    height: 38,
    backgroundColor: BLACK,
  },
});
