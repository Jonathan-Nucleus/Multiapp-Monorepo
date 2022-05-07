import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';

import { WHITE, PRIMARYSOLID, GRAY700 } from 'shared/src/colors';
import { Body2, Body2Bold, Body3, Body4Thin } from 'mobile/src/theme/fonts';

import { Message } from 'mobile/src/services/chat';
import ChatAvatar from 'mobile/src/components/main/chat/ChatAvatar';

interface MessageItemProps {
  message: Message;
  isMine: boolean;
  finalMessage?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isMine,
  finalMessage = true,
}) => {
  const { created_at } = message;
  return (
    <View
      style={[
        styles.row,
        styles.container,
        isMine ? styles.justifyEnd : styles.justifyStart,
        finalMessage ? styles.finalMessage : null,
      ]}>
      {finalMessage && !isMine && message.user && (
        <ChatAvatar
          user={message.user}
          size={32}
          showOnlineStatus={false}
          style={styles.avatar}
        />
      )}
      <View
        style={[styles.message, !finalMessage ? styles.avatarSpacer : null]}>
        <View
          style={[
            styles.messageBubble,
            isMine ? styles.myMessage : styles.theirMessage,
          ]}>
          <Text style={[styles.textWhite, Body3]}>{message.text}</Text>
        </View>
        {finalMessage && (
          <View
            style={[
              styles.row,
              isMine ? styles.justifyEnd : styles.justifyStart,
            ]}>
            <Text style={styles.timestamp}>
              {dayjs(created_at).format('h:mmA')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  finalMessage: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
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
  message: {
    maxWidth: '75%',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  myMessage: {
    backgroundColor: PRIMARYSOLID,
    borderBottomRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: GRAY700,
    borderBottomLeftRadius: 0,
  },
  avatarSpacer: {
    marginLeft: 44,
  },
  avatar: {
    marginRight: 12,
    marginBottom: 18,
  },
  timestamp: {
    marginTop: 6,
    height: 12,
    color: WHITE,
    ...Body4Thin,
  },
});
