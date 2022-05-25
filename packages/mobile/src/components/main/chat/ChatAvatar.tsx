import React from 'react';
import { StyleSheet, StyleProp, View, ViewStyle } from 'react-native';

import Avatar from 'mobile/src/components/common/Avatar';
import { User } from 'mobile/src/services/chat';

interface ChatAvatarProps {
  user: User;
  showOnlineStatus?: boolean;
  size?: number;
  onlineStatusSize?: number;
  style?: StyleProp<ViewStyle>;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({
  user,
  showOnlineStatus = true,
  size = 48,
  onlineStatusSize = 16,
  style,
}) => {
  const { online } = user;

  const sizeStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const indicatorSizeStyle = {
    width: onlineStatusSize,
    height: onlineStatusSize,
    borderRadius: onlineStatusSize / 2,
  };

  return (
    <View style={[styles.avatarContainer, sizeStyle, style]}>
      <Avatar user={user} size={size} />
      {showOnlineStatus && online && (
        <View style={[styles.onlineIndicator, indicatorSizeStyle]} />
      )}
    </View>
  );
};

export default ChatAvatar;

const styles = StyleSheet.create({
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  onlineIndicator: {
    backgroundColor: 'green',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});
