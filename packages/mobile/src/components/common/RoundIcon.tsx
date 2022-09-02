import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { GRAY1, GRAY2 } from 'shared/src/colors';

interface RoundIconProps {
  icon: React.ReactNode;
  onPress?: () => void;
}

const RoundIcon: React.FC<RoundIconProps> = (props) => {
  const { icon, onPress } = props;

  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: GRAY2,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GRAY1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginRight: 4,
  },
});

export default RoundIcon;
