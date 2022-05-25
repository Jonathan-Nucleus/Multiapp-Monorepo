import React, { FC } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import UserInfo from 'mobile/src/components/common/UserInfo';

import {
  User,
  OnSelectUser,
} from 'mobile/src/components/common/ExpandingInput';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE12, BLACK } from 'shared/src/colors';

interface MentionsListProps {
  users: User[];
  onPress: OnSelectUser;
  containerStyle?: StyleProp<ViewStyle>;
  listStyle?: StyleProp<ViewStyle>;
}

const MentionsList: FC<MentionsListProps> = ({
  users,
  onPress,
  containerStyle,
  listStyle,
}) => {
  return (
    <View style={[styles.mentionsContainer, containerStyle]}>
      {users.length > 0 && (
        <ScrollView
          style={styles.mentionList}
          contentContainerStyle={[styles.mentionContentContainer, listStyle]}
          keyboardShouldPersistTaps="handled">
          <View style={styles.flex}>
            {users.map((user, index) => (
              <Pressable
                key={user._id}
                onPress={() => onPress(user)}
                style={({ pressed }) => [
                  index < users.length - 1 ? styles.mentionItem : null,
                  pressed ? pStyles.pressedStyle : null,
                ]}>
                <UserInfo user={user} avatarSize={32} showFollow={false} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default MentionsList;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  mentionList: {
    backgroundColor: BLACK,
    paddingHorizontal: 16,
    borderRadius: 16,
    maxHeight: 270,
    flexGrow: 0,
    width: '100%',
    bottom: 0,
  },
  mentionContentContainer: {
    marginVertical: 8,
  },
  mentionItem: {
    borderBottomWidth: 1,
    borderBottomColor: WHITE12,
  },
  mentionsContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 4,
    zIndex: 20,
  },
});
