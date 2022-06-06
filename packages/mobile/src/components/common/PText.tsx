import React from 'react';
import { Text, TextProps } from 'react-native';

const PText: React.FC<TextProps> = ({ children, ...props }) => {
  return (
    <Text allowFontScaling={false} {...props}>
      {children}
    </Text>
  );
};

export default PText;
