import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import PLabel from './PLabel';

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  textStyle?: object;
  onPress?: () => void;
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { icon, label, textStyle, onPress } = props;

  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapper}>
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
