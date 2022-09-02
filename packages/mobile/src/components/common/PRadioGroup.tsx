import React, {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Text,
  StyleSheet,
  ViewStyle,
  ColorValue,
  StyleProp,
} from 'react-native';

export interface PRadioOption<TValue = string> {
  id: TValue | number;
  value?: string;
  label?: string;
  labelView?: ReactElement;
}

type OptionStyle = StyleProp<ViewStyle> & {
  fillColor: ColorValue | undefined;
};

type OptionProps = {
  id: string | number;
  active: boolean;
  optionStyle?: OptionStyle;
};

const arePropsEqual = (
  prevProps: OptionProps,
  nextProps: OptionProps,
): boolean => {
  return prevProps.active === nextProps.active;
};

const Option = memo(({ id, active, optionStyle }: OptionProps) => {
  const [animatedHeight] = useState(new Animated.Value(0));
  const [animatedWidth] = useState(new Animated.Value(0));
  const [optionWidth, setOptionWidth] = useState(0);
  const [optionHeight, setOptionHeight] = useState(0);

  const startAnimation = useCallback(() => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: active ? optionHeight - 6 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animatedWidth, {
        toValue: active ? optionWidth - 6 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [active, animatedHeight, animatedWidth, optionHeight, optionWidth]);

  useEffect(() => {
    startAnimation();
  }, [active, startAnimation]);

  const setWidthHeightLayout = (evt: {
    nativeEvent: { layout: { width: number; height: number } };
  }): void => {
    const { width, height } = evt.nativeEvent.layout;
    setOptionWidth(width);
    setOptionHeight(height);
    startAnimation();
  };
  const animatedStyle = {
    backgroundColor: optionStyle?.fillColor,
    height: animatedHeight,
    width: animatedWidth,
  };
  return (
    <View
      key={id}
      style={[styles.option, optionStyle]}
      onLayout={setWidthHeightLayout}>
      <Animated.View style={[styles.fill, animatedStyle]} />
    </View>
  );
}, arePropsEqual);

export interface RadioGroupProps<TValue = string> {
  options: PRadioOption<TValue>[];
  horizontal?: boolean;
  optionStyle?: OptionStyle;
  activeOptionId: PRadioOption['id'];
  onChange: (option: PRadioOption<TValue>) => void | Promise<void>;
}

const PRadioGroup = ({
  options,
  horizontal = false,
  optionStyle,
  activeOptionId,
  onChange,
}: RadioGroupProps): ReactElement => {
  const onPress = (option: PRadioOption): void => {
    if (option.id === activeOptionId) {
      return;
    }

    onChange(option);
  };

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        horizontal && styles.horizontal,
      ])}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.radio}
          onPress={() => onPress(option)}>
          <Option
            id={option.id}
            active={activeOptionId === option.id}
            optionStyle={optionStyle}
          />
          {option.label && <Text>{option.label}</Text>}
          {!option.label && option.labelView}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
  },
  horizontal: {
    flexDirection: 'row',
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 10,
  },
  option: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // customizable properties are as follows...
    width: 22,
    height: 22,
    borderColor: '#000',
    borderWidth: 0.8,
    marginRight: 10,
  },
  fill: {
    borderRadius: 20,
    backgroundColor: '#279315',
  },
});

export default PRadioGroup;
