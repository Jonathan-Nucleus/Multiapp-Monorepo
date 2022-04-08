import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

import { BLACK, SUCCESS } from 'shared/src/colors';
import { Body2 } from '../../theme/fonts';

interface SuccessTextProps {
  message: string;
  textStyle?: StyleProp<TextStyle>;
  container?: StyleProp<ViewStyle>;
}

const SuccessText: React.FC<SuccessTextProps> = (props) => {
  const { message, textStyle, container } = props;

  return (
    <View style={[styles.successView, container]}>
      <Text style={[styles.success, textStyle]}>{message}</Text>
    </View>
  );
};

export default SuccessText;

const styles = StyleSheet.create({
  successView: {
    marginBottom: 18,
    backgroundColor: SUCCESS,
    borderRadius: 16,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },
  success: {
    color: BLACK,
    ...Body2,
  },
});
