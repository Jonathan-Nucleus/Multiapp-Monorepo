import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GRAY10 } from 'shared/src/colors';
import { Body3 } from '../../theme/fonts';
import PLabel from './PLabel';

interface TagProps {
  viewStyle?: object;
  textStyle?: object;
  label: string;
  isSelected?: boolean;
}

const Tag: React.FC<TagProps> = (props) => {
  const { viewStyle, textStyle, label } = props;

  return (
    <View style={[styles.container, viewStyle]}>
      <PLabel label={label} textStyle={[styles.textStyle, textStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    backgroundColor: GRAY10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  textStyle: {
    ...Body3,
    textTransform: 'uppercase',
  },
});

export default Tag;
