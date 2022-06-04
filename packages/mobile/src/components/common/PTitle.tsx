import React from 'react';
import { View, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

import { H5, Body2 } from '../../theme/fonts';
import { WHITE } from 'shared/src/colors';

interface TitleProps {
  style?: ViewStyle | TextStyle;
  textStyle?: TextStyle;
  title?: string;
  subTitle?: string;
}

const PTitle: React.FC<TitleProps> = (props) => {
  const { style, textStyle, title, subTitle } = props;

  return (
    <View style={style}>
      <Text style={[styles.text, textStyle]} allowFontScaling={false}>
        {title}
      </Text>
      <Text style={[styles.subTxt]} allowFontScaling={false}>
        {subTitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: WHITE,
    ...H5,
  },
  subTxt: {
    color: WHITE,
    ...Body2,
  },
});

export default PTitle;
