import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FormatMessageResponse } from 'stream-chat';

import { WHITE } from 'shared/src/colors';
import { Body2, Body2Bold } from 'mobile/src/theme/fonts';

import { ChatContext } from 'mobile/src/context/Chat';
import ChatAvatar from 'mobile/src/components/main/chat/ChatAvatar';

interface MessageItemProps {
  message: FormatMessageResponse;
  isMine: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <View style={[styles.row, styles.container]}>
      <Text style={[styles.textWhite, Body2]}>{message.text}</Text>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  col: {
    flexDirection: 'column',
  },
  textWhite: {
    color: WHITE,
  },
  userInfo: {
    paddingLeft: 8,
  },
});
