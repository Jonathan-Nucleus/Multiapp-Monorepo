import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

interface HeaderProps {
  onPressLeft?: () => void;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  centerIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  outerContainerStyle?: StyleProp<ViewStyle>;
  leftStyle?: StyleProp<ViewStyle>;
  rightStyle?: StyleProp<ViewStyle>;
  dividerColor?: string;
}
const PHeader: React.FC<HeaderProps> = (props) => {
  const {
    onPressLeft,
    rightIcon,
    leftIcon,
    centerIcon,
    containerStyle,
    outerContainerStyle,
    leftStyle,
    rightStyle,
    dividerColor,
  } = props;

  const insets = useSafeAreaInsets();
  const outerStyles = {
    paddingTop: insets.top,
  };

  return (
    <View style={[styles.outerContainer, outerContainerStyle, outerStyles]}>
      <View style={[styles.container, containerStyle]}>
        {!!leftIcon && (
          <TouchableOpacity
            onPress={onPressLeft}
            disabled={onPressLeft ? false : true}
            style={leftStyle}>
            {leftIcon}
          </TouchableOpacity>
        )}
        <View style={styles.flex}>{centerIcon}</View>
        {!!rightIcon && <View style={rightStyle}>{rightIcon}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  container: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
  },
  flex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PHeader;
