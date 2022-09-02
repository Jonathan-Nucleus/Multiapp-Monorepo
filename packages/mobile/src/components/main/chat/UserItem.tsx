import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Check } from 'phosphor-react-native';

import { PRIMARYSOLID, WHITE } from 'shared/src/colors';
import { Body2, Body2Bold } from 'mobile/src/theme/fonts';

import ChatAvatar from 'mobile/src/components/main/chat/ChatAvatar';
import { useCheck } from 'mobile/src/context/Chat';
import { User } from 'mobile/src/services/chat';

interface UserItemProps {
  user: User;
  onPress?: (user: User) => void;
  selectedUsers: User[];
}

const UserItem: React.FC<UserItemProps> = ({
  user,
  onPress,
  selectedUsers,
}) => {
  const { select } = useCheck();
  return (
    <Pressable
      onPress={() => {
        onPress?.(user);
        select(true);
      }}
      style={({ pressed }) => (pressed ? styles.pressed : null)}>
      <View style={[styles.row, styles.container]}>
        <ChatAvatar user={user} />
        <View style={[styles.col, styles.userInfo]}>
          <Text
            style={[
              styles.textWhite,
              Body2Bold,
            ]}>{`${user.firstName} ${user.lastName}`}</Text>
          {user.position ? (
            <Text style={[styles.textWhite, Body2]}>{`${user.position}${
              user.company ? ` @ ${user.company}` : ''
            }`}</Text>
          ) : null}
        </View>
        {selectedUsers.map((selected) =>
          selected.id === user.id ? (
            <Check size={24} color={PRIMARYSOLID} />
          ) : null,
        )}
      </View>
    </Pressable>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginRight: 8,
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
    flex: 1,
  },
});
