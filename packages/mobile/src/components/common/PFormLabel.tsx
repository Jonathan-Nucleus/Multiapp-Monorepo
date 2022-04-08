import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { Body2 } from '../../theme/fonts';
import { WHITE } from 'shared/src/colors';

interface FormLabelProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  label: string;
  onPress?: () => void;
}

const PFormLabel: React.FC<FormLabelProps> = (props) => {
  const { style, textStyle, label, onPress } = props;

  return (
    <TouchableWithoutFeedback onPress={() => onPress && onPress()}>
      <View style={[styles.container, style]}>
        <Text style={[styles.textStyle, textStyle]}>{label}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  textStyle: {
    color: WHITE,
    ...Body2,
  },
});

export default PFormLabel;
