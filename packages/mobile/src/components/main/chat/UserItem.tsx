import React, { useContext } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Channel } from 'stream-chat';

import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import { WHITE } from 'shared/src/colors';
import { Body2, Body2Bold } from 'mobile/src/theme/fonts';

import { useChatContext, User } from 'mobile/src/context/Chat';
import ChatAvatar from 'mobile/src/components/main/chat/ChatAvatar';
import { channelName } from 'mobile/src/utils/chat';

interface UserItemProps {
  user: User;
  onPress?: (user: User) => void;
}

const UserItem: React.FC<UserItemProps> = ({ user, onPress }) => {
  return (
    <Pressable
      onPress={() => onPress?.(user)}
      style={({ pressed }) => (pressed ? styles.pressed : null)}>
      <View style={[styles.row, styles.container]}>
        <ChatAvatar user={user} />
        <View style={[styles.col, styles.userInfo]}>
          <Text style={[styles.textWhite, Body2Bold]}>{user.name}</Text>
          <Text style={[styles.textWhite, Body2]}>Lorem...</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default UserItem;

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
  pressed: {
    opacity: 0.5,
  },
  textWhite: {
    color: WHITE,
  },
  userInfo: {
    paddingLeft: 16,
  },
});
