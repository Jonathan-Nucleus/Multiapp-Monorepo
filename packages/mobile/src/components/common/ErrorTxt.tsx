import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

import { WHITE, DANGER } from 'shared/src/colors';
import { Body2 } from '../../theme/fonts';
import ErrorSvg from '../../assets/icons/alert.svg';

interface ErrorTextProps {
  error: string;
  errorStyle?: StyleProp<TextStyle>;
  errorContainer?: StyleProp<ViewStyle>;
}

const ErrorText: React.FC<ErrorTextProps> = (props) => {
  const { error, errorStyle, errorContainer } = props;

  return (
    <View style={[styles.errorView, errorContainer]}>
      <ErrorSvg />
      <Text style={[styles.error, errorStyle]}>{error}</Text>
    </View>
  );
};

export default ErrorText;

const styles = StyleSheet.create({
  errorView: {
    marginBottom: 18,
    backgroundColor: DANGER,
    borderRadius: 16,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },
  error: {
    color: WHITE,
    ...Body2,
    marginLeft: 11,
  },
});
