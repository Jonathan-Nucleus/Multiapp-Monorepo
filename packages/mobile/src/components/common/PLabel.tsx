import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Body2 } from '../../theme/fonts';
import { WHITE } from 'shared/src/colors';

interface PLabelProps {
  viewStyle?: ViewStyle;
  textStyle?: TextStyle;
  label: string;
  numberOfLines?: number;
}

const PLabel: React.FC<PLabelProps> = (props) => {
  const { viewStyle, textStyle, label, numberOfLines } = props;

  return (
    <View style={[styles.container, viewStyle]}>
      <Text style={[styles.textStyle, textStyle]} numberOfLines={numberOfLines}>
        {label}
      </Text>
    </View>
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
