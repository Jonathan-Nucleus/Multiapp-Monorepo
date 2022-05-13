import React, { forwardRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import PLabel from './PLabel';
import { PRIMARYSOLID, WHITE } from 'shared/src/colors';
import { Body2Bold } from '../../theme/fonts';

interface PostCategoryProps {
  id: number;
  value: boolean;
  showBackground?: boolean;
  category: string;
  children?: React.ReactNode;
  viewStyle?: object;
  handleChange: (id: number) => void;
  disabled?: boolean;
}

const CheckboxLabel = forwardRef<CheckBox, PostCategoryProps>((props, ref) => {
  const {
    id,
    category,
    showBackground,
    children,
    value,
    viewStyle,
    handleChange,
    disabled = false,
  } = props;

  const onChange = () => !disabled && handleChange(id);
  return (
    <View
      style={[
        styles.wrapper,
        viewStyle,
        value && showBackground && styles.checkedWrapper,
        disabled && styles.disabled,
      ]}>
      <CheckBox
        disabled={disabled}
        value={value}
        boxType="square"
        onCheckColor={PRIMARYSOLID}
        onFillColor={WHITE}
        onTintColor={WHITE}
        lineWidth={2}
        onValueChange={onChange}
        style={styles.checkBox}
      />
      <Pressable onPress={onChange} style={styles.flex}>
        {children ? (
          children
        ) : (
          <PLabel label={category} viewStyle={styles.label} />
        )}
      </Pressable>
    </View>
  );
});

export default CheckboxLabel;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    marginBottom: 8,
    width: '45%',
    height: 48,
    borderRadius: 32,
    borderColor: PRIMARYSOLID,
    borderWidth: 1,
  },
  checkedWrapper: {
    backgroundColor: PRIMARYSOLID,
  },
  checkBox: {
    width: 20,
    height: 20,
  },
  label: {
    marginLeft: 12,
    ...Body2Bold,
  },
  flex: {
    flex: 1,
  },
  disabled: {
    opacity: 0.3,
  },
});
