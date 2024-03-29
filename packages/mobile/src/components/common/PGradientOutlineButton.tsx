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

interface OutlineButtonProps {
  btnContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const PGradientOutlineButton: React.FC<OutlineButtonProps> = (props) => {
  const {
    btnContainerStyle,
    containerStyle,
    textStyle,
    label,
    onPress,
    disabled = false,
    loading = false,
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={btnContainerStyle}>
      <LinearGradient
        colors={disabled ? ['#FFFFFF61', '#FFFFFF61'] : ['#844AFF', '#00AAE0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.outlineButton, containerStyle]}>
        {loading ? (
          <UIActivityIndicator color={WHITE} size={24} />
        ) : (
          <View style={styles.outlineTxtWrap}>
            <Text
              allowFontScaling={false}
              style={[
                styles.outlineTextStyle,
                textStyle,
                disabled && styles.outlineDisabledLabel,
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
  outlineButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 0,
    borderRadius: 32,
    height: 40,
    borderColor: WHITE,
    borderWidth: 1,
  },
  outlineDisabledLabel: {
    color: DISABLEDTXT,
  },
  outlineTextStyle: {
    color: WHITE,
    ...Body2,
    textTransform: 'capitalize',
  },
  outlineTxtWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '99%',
    paddingVertical: 0,
    borderRadius: 80,
    height: 38,
    backgroundColor: BLACK,
  },
});
