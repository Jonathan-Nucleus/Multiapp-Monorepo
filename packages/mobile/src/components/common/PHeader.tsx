import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';

interface HeaderProps {
  onPressLeft?: () => void;
  onPressRight?: () => void;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  centerIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  leftStyle?: StyleProp<ViewStyle>;
  rightStyle?: StyleProp<ViewStyle>;
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
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    height: 96,
  },
  leftIcon: {
    position: 'absolute',
    left: 16,
    top: 52,
  },
  rightIcon: {
    position: 'absolute',
    right: 16,
    top: 52,
  },
});

export default PHeader;
