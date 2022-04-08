import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface HeaderProps {
  onPressLeft?: () => void;
  onPressRight?: () => void;
  rightIcon?: any;
  leftIcon?: any;
  centerIcon?: any;
  containerStyle?: ViewStyle;
  leftStyle?: ViewStyle;
  rightStyle?: ViewStyle;
}
const PHeader: React.FC<HeaderProps> = (props) => {
  const {
    onPressLeft,
    onPressRight,
    rightIcon,
    leftIcon,
    centerIcon,
    containerStyle,
    leftStyle,
    rightStyle,
  } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      {!!leftIcon && (
        <TouchableOpacity
          onPress={onPressLeft}
          style={[styles.leftIcon, leftStyle]}>
          {leftIcon}
        </TouchableOpacity>
      )}
      {centerIcon}
      {!!rightIcon && (
        <TouchableOpacity
          onPress={onPressRight}
          style={[styles.rightIcon, rightStyle]}>
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  leftIcon: {},
  rightIcon: {},
});

export default PHeader;
