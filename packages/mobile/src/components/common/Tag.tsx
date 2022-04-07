import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { GRAY10, PRIMARYLIGHT, PRIMARYSTATE } from 'shared/src/colors';
import { Body3 } from '../../theme/fonts';
import PLabel from './PLabel';

interface TagProps {
  viewStyle?: object;
  textStyle?: object;
  label: string;
  isSelected?: boolean;
  onPress?: (v: string) => void;
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

  return (
    <TouchableOpacity
      style={usedViewStyle}
      onPress={() => (onPress ? onPress(label) : {})}
    >
      <PLabel label={label} textStyle={usedTextStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    backgroundColor: GRAY10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectedContainer: {
    backgroundColor: PRIMARYLIGHT,
  },
  textStyle: {
    ...Body3,
    textTransform: 'uppercase',
  },
  selectedTextStyle: {
    color: PRIMARYSTATE,
  },
});

export default Tag;
