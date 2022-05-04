import React, { FC, useRef, useState, useEffect } from 'react';
import { ListRenderItem, StyleSheet, FlatList, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaretLeft } from 'phosphor-react-native';
import {
  Channel as SCChannel,
  ChannelSort,
  FormatMessageResponse as SCMessage,
} from 'stream-chat';

import PHeader from 'mobile/src/components/common/PHeader';
import MainHeader from 'mobile/src/components/main/Header';
import { Body1, Body2, Body3 } from 'mobile/src/theme/fonts';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE, BGDARK } from 'shared/src/colors';

import { useChatContext } from 'mobile/src/context/Chat';
import MessageItem from 'mobile/src/components/main/chat/MessageItem';

import { ChannelScreen } from 'mobile/src/navigations/ChatStack';

const DEFAULT_SORT: ChannelSort = {
  last_message_at: -1,
  updated_at: -1,
  cid: 1,
};

const Channel: ChannelScreen = ({ navigation, route }) => {
  const { channelId, initialData } = route.params;

  const { client, userId } = useChatContext();
  const channel = useRef(initialData);
  const [messages, setMesages] = useState(initialData?.state.messages ?? []);

  const fetchChannel = async () => {
    const channelData = await client.queryChannels(
      {
        type: 'messaging',
        cid: channelId,
      },
      DEFAULT_SORT,
    );

    channel.current = channelData[0];
  };

  useEffect(() => {
    if (!initialData) {
      fetchChannel();
    }
  }, []);

  const renderItem: ListRenderItem<SCMessage> = ({ item }) => (
    <MessageItem message={item} isMine={item.user_id === userId} />
  );

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader />
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
        ListHeaderComponent={
          <View>
            <Text>Messages</Text>
          </View>
        }
      />
    </View>
  );
};

export default Channel;

const styles = StyleSheet.create({
  headerTitle: {
    ...Body1,
    color: WHITE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
