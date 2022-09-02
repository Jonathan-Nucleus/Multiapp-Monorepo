import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

import { WHITE, GRAY100, PRIMARYSOLID, BLACK } from 'shared/src/colors';
import { Body2, Body2Bold } from 'mobile/src/theme/fonts';

import { useAccountContext } from 'shared/context/Account';
import ChatAvatar from 'mobile/src/components/main/chat/ChatAvatar';
import { channelName, Channel } from 'mobile/src/services/chat';

interface ArchivedItemProps {
  channel: Channel;
}

const ArchivedItem: React.FC<ArchivedItemProps> = ({ channel }) => {
  const arcAccount = useAccountContext();
  const { _id: userId } = arcAccount;
  const { members } = channel.state;

  const arcUsers = Object.keys(members).filter((key) => key !== userId);
  const arcFirstUser = members[arcUsers[0]];

  const lastMessage = channel.lastMessage();
  return (
    <View style={[styles.arcRow, styles.arcContainer]}>
      {channel.state.unreadCount > 0 ? (
        <View style={styles.arcUnreadIndicator} />
      ) : null}
      {arcFirstUser.user && <ChatAvatar user={arcFirstUser.user} />}
      <View style={[styles.arcCol, styles.arcUserInfo]}>
        <Text style={[styles.arcTextWhite, Body2Bold]}>
          {channelName(channel, userId)}
        </Text>
        {lastMessage && (
          <View style={[styles.arcPreview]}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.arcPreviewText, styles.arcFlexShrink]}>
              {lastMessage.text}
            </Text>
            <Text style={styles.arcPreviewText}>
              {' '}
              • {dayjs(lastMessage.created_at).fromNow()}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ArchivedItem;

const styles = StyleSheet.create({
  arcContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'relative',
    backgroundColor: BLACK,
  },
  arcUnreadIndicator: {
    position: 'absolute',
    width: 8,
    left: 6,
    aspectRatio: 1,
    borderRadius: 4,
    backgroundColor: PRIMARYSOLID,
  },
  arcFlexShrink: {
    flexShrink: 1,
  },
  arcRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arcCol: {
    flexDirection: 'column',
  },
  arcPressed: {
    opacity: 0.5,
  },
  arcTextWhite: {
    color: WHITE,
  },
  arcUserInfo: {
    paddingLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  arcPreview: {
    marginRight: 16,
    marginTop: 4,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  arcPreviewText: {
    ...Body2,
    color: GRAY100,
  },
});
