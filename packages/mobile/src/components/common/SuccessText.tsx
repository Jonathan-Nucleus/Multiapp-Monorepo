import { CheckCircle } from 'phosphor-react-native';
import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

import { SUCCESS, WHITE } from 'shared/src/colors';
import { Body2 } from '../../theme/fonts';
import PText from './PText';

interface SuccessTextProps {
  message: string;
  textStyle?: StyleProp<TextStyle>;
  container?: StyleProp<ViewStyle>;
}

const SuccessText: React.FC<SuccessTextProps> = (props) => {
  const { message, textStyle, container } = props;

  return (
    <View style={[styles.successView, container]}>
      <CheckCircle color={WHITE} />
      <View style={styles.txtContainer}>
        <PText style={[styles.success, textStyle]} allowFontScaling={false}>
          {message}
        </PText>
      </View>
    </View>
  );
};

export default SuccessText;

const styles = StyleSheet.create({
  successView: {
    marginBottom: 18,
    backgroundColor: SUCCESS,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtContainer: {
    flex: 1,
    paddingLeft: 13,
  },
  success: {
    color: WHITE,
    ...Body2,
  },
});
