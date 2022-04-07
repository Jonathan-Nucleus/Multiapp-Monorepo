import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import PLabel from './PLabel';

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  viewStyle?: object;
  textStyle?: object;
  onPress?: () => void;
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { icon, label, viewStyle, textStyle, onPress } = props;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.wrapper, viewStyle]}>
      {icon}
      <PLabel label={label} textStyle={[styles.textStyle, textStyle]} />
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    marginLeft: 5,
  },
});
