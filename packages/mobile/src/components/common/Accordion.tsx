import React, { PropsWithChildren, useState, useRef } from 'react';
import {
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  StyleProp,
  Pressable,
} from 'react-native';
import { CaretDown, CaretUp } from 'phosphor-react-native';
/*import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';*/

import PText from 'mobile/src/components/common/PText';
import { Body2 } from '../../theme/fonts';
import { WHITE } from 'shared/src/colors';

interface AccordionProps extends PropsWithChildren<unknown> {
  headerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  title: string;
  initiallyExpanded?: boolean;
}

const Accordion: React.FC<AccordionProps> = (props) => {
  const {
    children,
    containerStyle,
    headerStyle,
    titleStyle,
    title,
    initiallyExpanded = false,
  } = props;
  const [isExpanded, setExpanded] = useState(initiallyExpanded);
  const expandedHeight = useRef(0);
  /*const height = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: offset.value,
    };
  });*/

  const toggleView = (): void => {
    console.log('height', expandedHeight.current);
    setExpanded(!isExpanded);
  };

  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <View style={[styles.header, headerStyle]}>
        <Pressable onPress={toggleView} style={styles.toggleButton}>
          {isExpanded ? (
            <CaretUp size={24} color={WHITE} />
          ) : (
            <CaretDown size={24} color={WHITE} />
          )}
        </Pressable>
        <PText style={[styles.title, titleStyle]}>{title}</PText>
      </View>
      <View
        style={[
          styles.collapseContainer,
          {
            ...(!isExpanded
              ? { height: 0 }
              : { height: expandedHeight.current }),
          },
        ]}>
        <View
          onLayout={(evt) => {
            expandedHeight.current = evt.nativeEvent.layout.height;
            console.log('Height:', expandedHeight.current);
          }}
          style={[
            styles.container,
            {
              ...(expandedHeight.current
                ? { height: expandedHeight.current }
                : {}),
            },
          ]}>
          {children}
        </View>
      </View>
    </View>
  );
};

export default Accordion;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 0,
  },
  title: {
    color: WHITE,
    ...Body2,
  },
  toggleButton: {
    paddingHorizontal: 16,
  },
  collapseContainer: {
    position: 'relative',
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
