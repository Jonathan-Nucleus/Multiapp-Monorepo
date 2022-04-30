import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { GRAY10, PRIMARYLIGHT, PRIMARYSTATE } from 'shared/src/colors';
import { Body3 } from '../../theme/fonts';
import PLabel from './PLabel';

interface TagProps {
  viewStyle?: object;
  textStyle?: object;
  label: string;
  isSelected?: boolean;
  onPress?: (label: string) => void;
}

const Tag: React.FC<TagProps> = (props) => {
  const { viewStyle, textStyle, label, isSelected, onPress } = props;

  const usedViewStyle = [
    styles.container,
    isSelected && styles.selectedContainer,
    viewStyle,
  ];

  const usedTextStyle = [
    styles.textStyle,
    isSelected && styles.selectedTextStyle,
    textStyle,
  ];

  const child = <PLabel label={label} textStyle={usedTextStyle} />;
  return onPress ? (
    <TouchableOpacity style={usedViewStyle} onPress={() => onPress(label)}>
      {child}
    </TouchableOpacity>
  ) : (
    <View style={usedViewStyle}>{child}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: GRAY10,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  selectedContainer: {
    backgroundColor: PRIMARYLIGHT,
  },
  textStyle: {
    ...Body3,
    textTransform: 'uppercase',
    letterSpacing: 1.25,
    fontWeight: 'bold',
  },
  selectedTextStyle: {
    color: PRIMARYSTATE,
  },
});

export default Tag;
