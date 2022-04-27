import React, { FC, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Suggestion } from 'react-native-controlled-mentions';

import UserInfo from '../../components/common/UserInfo';
import Avatar from '../../assets/avatar.png';
import { DISABLED } from 'shared/src/colors';

interface MentionItemProps {
  suggestion: Suggestion;
  onPress?: (suggestion: Suggestion) => void;
}

const MentionItem: FC<MentionItemProps> = ({ suggestion, onPress }) => {
  const handlePress = useCallback(() => {
    onPress?.(suggestion);
  }, [suggestion, onPress]);

  return (
    <Pressable
      key={suggestion.id}
      onPress={handlePress}
      style={styles.mentionItem}>
      <UserInfo
        avatar={Avatar}
        name={suggestion.name}
        isPro
        role="CEO"
        company="Funds"
      />
    </Pressable>
  );
};

export default MentionItem;

const styles = StyleSheet.create({
  mentionItem: {
    borderBottomWidth: 1,
    borderBottomColor: DISABLED,
  },
});
