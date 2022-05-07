import React from 'react';
import { StyleSheet, StyleProp, Text, View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';

import Avatar from 'mobile/src/components/common/Avatar';
import { WHITE } from 'shared/src/colors';
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
  const { name, online, image } = user;
  const initials =
    name
      ?.toUpperCase()
      .split(' ')
      .map((word) => word.charAt(0))
      .join('') ?? '';

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
      {image ? (
        <FastImage
          style={sizeStyle}
          source={{
            uri: image,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <Text>{initials}</Text>
      )}

      {showOnlineStatus && online && (
        <View style={[styles.onlineIndicator, indicatorSizeStyle]} />
      )}
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
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});
