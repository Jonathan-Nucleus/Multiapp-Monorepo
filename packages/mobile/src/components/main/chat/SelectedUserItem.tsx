import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { XCircle } from 'phosphor-react-native';

import { PRIMARYSOLID, WHITE } from 'shared/src/colors';
import { Body2Bold } from 'mobile/src/theme/fonts';

import { User } from 'mobile/src/services/chat';
import { useCheck } from '../../../context/Chat';

interface SelectedUserItemProps {
  user: User;
  onRemove?: (user: User) => void;
}

const SelectedUserItem: React.FC<SelectedUserItemProps> = ({
  user,
  onRemove,
}) => {
  const { remove } = useCheck();
  return (
    <View style={[styles.row, styles.container]}>
      <View style={[styles.col, styles.userInfo]}>
        <Text
          style={[
            styles.textWhite,
            Body2Bold,
          ]}>{`${user.firstName} ${user.lastName}`}</Text>
      </View>
      {onRemove ? (
        <Pressable
          style={({ pressed }) => (pressed ? styles.pressed : null)}
          onPress={() => {
            onRemove(user);
            remove(false);
          }}>
          <XCircle size={20} color={WHITE} />
        </Pressable>
      ) : null}
    </View>
  );
};

export default SelectedUserItem;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 150,
    marginTop: 8,
    marginLeft: 8,
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: PRIMARYSOLID,
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
