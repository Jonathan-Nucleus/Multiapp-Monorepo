import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Avatar from 'mobile/src/components/common/Avatar';

import { WHITE } from 'shared/src/colors';

interface ChatAvatarProps {
  name: string;
  image?: string;
  online?: boolean;
  size?: number;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({
  name,
  online = true,
  size = 48,
}) => {
  const initials = name
    .toUpperCase()
    .split(' ')
    .map((word) => word.charAt(0))
    .join('');

  const sizeStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View style={[styles.avatarContainer, sizeStyle]}>
      <Text>{initials}</Text>
      {online && <View style={styles.onlineIndicator} />}
    </View>
  );
};

export default ChatAvatar;

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: WHITE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  onlineIndicator: {
    backgroundColor: 'green',
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});
