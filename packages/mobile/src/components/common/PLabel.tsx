import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { Body2 } from '../../theme/fonts';
import { WHITE } from 'shared/src/colors';

interface PLabelProps {
  viewStyle?: object;
  textStyle?: object;
  label: string;
  onPress?: () => void;
}

const PLabel: React.FC<PLabelProps> = (props) => {
  const { viewStyle, textStyle, label, onPress } = props;

  return (
    <TouchableWithoutFeedback
      style={[styles.container, viewStyle]}
      onPress={onPress}>
      <Text style={[styles.textStyle, textStyle]}>{label}</Text>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {},
  textStyle: {
    color: WHITE,
    ...Body2,
  },
});

export default PLabel;
