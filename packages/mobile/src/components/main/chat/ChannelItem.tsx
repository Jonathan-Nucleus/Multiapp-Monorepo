import React, { useContext } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Channel } from 'stream-chat';

import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import { WHITE } from 'shared/src/colors';
import { Body2, Body2Bold } from 'mobile/src/theme/fonts';

import { useChatContext } from 'mobile/src/context/Chat';
import ChatAvatar from 'mobile/src/components/main/chat/ChatAvatar';

interface ChannelItemProps {
  channel: Channel;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ channel }) => {
  const { userId } = useChatContext();
  const { members } = channel.state;

  const users = Object.keys(members).filter((key) => key !== userId);
  const firstUser = members[users[0]];
  const channelName = (channel.data?.name || firstUser.user?.name) ?? '';

  const navigateToChat = (): void => {
    NavigationService.navigate('Channel', {
      channelId: channel.cid,
      initialData: channel,
    });
  };

  return (
    <Pressable
      onPress={navigateToChat}
      style={({ pressed }) => (pressed ? styles.pressed : null)}>
      <View style={[styles.row, styles.container]}>
        <ChatAvatar
          name={firstUser.user?.name ?? ''}
          online={firstUser.user?.online ?? false}
        />
        <View style={[styles.col, styles.userInfo]}>
          <Text style={[styles.textWhite, Body2Bold]}>{channelName}</Text>
          <Text style={[styles.textWhite, Body2]}>Lorem...</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ChannelItem;

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
    paddingLeft: 8,
  },
});
