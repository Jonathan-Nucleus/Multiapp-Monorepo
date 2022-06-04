import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import dayjs from 'dayjs';
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  relativeTime: {
    future: '',
    past: '%s',
    s: 'now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy',
  },
});

import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import { WHITE, GRAY100, PRIMARYSOLID } from 'shared/src/colors';
import { Body2, Body2Bold } from 'mobile/src/theme/fonts';

import { useAccountContext } from 'shared/context/Account';
import ChatAvatar from 'mobile/src/components/main/chat/ChatAvatar';
import { channelName, Channel } from 'mobile/src/services/chat';

interface ChannelItemProps {
  channel: Channel;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ channel }) => {
  const account = useAccountContext();
  const { _id: userId } = account;
  const { members } = channel.state;

  const users = Object.keys(members).filter((key) => key !== userId);
  const firstUser = members[users[0]];

  const navigateToChat = (): void => {
    NavigationService.navigate('Channel', {
      channelId: channel.cid,
      initialData: channel,
    });
  };

  const lastMessage = channel.lastMessage();
  return (
    <Pressable
      onPress={navigateToChat}
      style={({ pressed }) => (pressed ? styles.pressed : null)}>
      <View style={[styles.row, styles.container]}>
        {channel.state.unreadCount > 0 ? (
          <View style={styles.unreadIndicator} />
        ) : null}
        {firstUser.user && <ChatAvatar user={firstUser.user} />}
        <View style={[styles.col, styles.userInfo]}>
          <Text style={[styles.textWhite, Body2Bold]}>
            {channelName(channel, userId)}
          </Text>
          {lastMessage && (
            <View style={[styles.preview]}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.previewText, styles.flexShrink]}>
                {lastMessage.text}
              </Text>
              <Text style={styles.previewText}>
                {' '}
                • {dayjs(lastMessage.created_at).fromNow()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default ChannelItem;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'relative',
  },
  unreadIndicator: {
    position: 'absolute',
    width: 8,
    left: 6,
    aspectRatio: 1,
    borderRadius: 4,
    backgroundColor: PRIMARYSOLID,
  },
  flexShrink: {
    flexShrink: 1,
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
    justifyContent: 'center',
  },
  preview: {
    marginRight: 16,
    marginTop: 4,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  previewText: {
    ...Body2,
    color: GRAY100,
  },
});
