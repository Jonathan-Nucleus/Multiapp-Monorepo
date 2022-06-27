import React from 'react';
import { StyleSheet } from 'react-native';
import Markdown, { MarkdownProps } from 'react-native-markdown-display';

import { Body1Semibold, Body2 } from 'mobile/src/theme/fonts';
import { WHITE } from 'shared/src/colors';

const PMarkdown: React.FC<MarkdownProps> = ({ children, ...props }) => {
  return (
    <Markdown {...props} style={markdownStyles}>
      {children}
    </Markdown>
  );
};

export default PMarkdown;

const markdownStyles = StyleSheet.create({
  body: {
    color: WHITE,
    marginTop: 8,
    lineHeight: 20,
    ...Body2,
  },
  heading4: {
    marginTop: 8,
    marginBottom: -8,
    ...Body1Semibold,
  },
});
