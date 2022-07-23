import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface SpinnerProps {
  visible?: boolean;
}

const PSpinner: React.FC<SpinnerProps> = (props) => {
  const { visible = false } = props;

  const spinValue = useRef(new Animated.Value(0)).current;

  const anim = useRef(
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ),
  ).current;

  useEffect(() => {
    return () => anim.stop();
  }, []);

  useEffect(() => {
    if (visible) {
      spinValue.setValue(0);
      anim.start();
    }
  }, [visible])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) {
    return null;
  }

  return (
    <Animated.Image
      source={require('../../assets/VPBSpinner.png')}
      style={{
        width: '100%',
        height: '100%',
        transform: [{ rotate: spin }],
      }}
      resizeMode={'contain'}
    />
  );
};

export default PSpinner;
