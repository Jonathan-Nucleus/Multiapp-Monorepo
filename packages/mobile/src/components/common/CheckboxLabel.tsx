import React from 'react';
import { StyleSheet, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import PLabel from './PLabel';
import { PRIMARYOVERLAY, PRIMARY, BLACK } from 'shared/src/colors';

interface PostCategoryProps {
  id: number;
  value: boolean;
  category: string;
  viewStyle?: object;
  handleChange: (v: number) => void;
}

const CheckboxLabel: React.FC<PostCategoryProps> = (props) => {
  const { id, category, value, viewStyle, handleChange } = props;

  return (
    <View style={[styles.wrapper, viewStyle]}>
      <CheckBox
        disabled={false}
        value={value}
        boxType="square"
        onCheckColor={BLACK}
        onFillColor={PRIMARY}
        onTintColor={PRIMARY}
        lineWidth={2.5}
        onValueChange={() => handleChange(id)}
        style={styles.checkBox}
      />
      <PLabel label={category} viewStyle={styles.label} />
    </View>
  );
};

export default CheckboxLabel;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    marginBottom: 8,
    width: '45%',
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARYOVERLAY,
  },
  checkBox: {
    width: 20,
    height: 20,
  },
  label: {
    marginLeft: 8,
  },
});
