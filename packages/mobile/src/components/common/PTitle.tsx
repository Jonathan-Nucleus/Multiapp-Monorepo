import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { H5, Body2 } from '../../theme/fonts';
import { WHITE } from 'shared/src/colors';

const PTitle = (props: any) => {
  const { style, textStyle, title, subTitle } = props;

  return (
    <View style={style}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
      <Text style={[styles.subTxt]}>{subTitle}</Text>
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
