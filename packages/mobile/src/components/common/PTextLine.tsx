import React from 'react';
import { View, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

import { Body2 } from '../../theme/fonts';
import { WHITE, GRAY10 } from 'shared/src/colors';

interface TextLineProps {
  textStyle?: TextStyle;
  title: string;
  containerStyle?: ViewStyle;
}

const PTextLine: React.FC<TextLineProps> = (props) => {
  const { textStyle, title, containerStyle } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.line} />
      <Text style={[styles.text, textStyle]} allowFontScaling={false}>
        {title}
      </Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    color: WHITE,
    ...Body2,
    marginHorizontal: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: GRAY10,
  },
});

export default PTextLine;
