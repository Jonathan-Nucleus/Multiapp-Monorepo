import React, { FC, useState, useEffect } from 'react';
import { ListRenderItem, StyleSheet, FlatList, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaretLeft, MagnifyingGlass } from 'phosphor-react-native';
import { ChannelFilters, ChannelSort, Channel } from 'stream-chat';

import PHeader from 'mobile/src/components/common/PHeader';
import MainHeader from 'mobile/src/components/main/Header';
import { Body1, Body2, Body3 } from 'mobile/src/theme/fonts';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE, BGDARK } from 'shared/src/colors';

import { useChatContext } from 'mobile/src/context/Chat';
import ChannelItem from 'mobile/src/components/main/chat/ChannelItem';

import { ChannelListScreen } from 'mobile/src/navigations/ChatStack';

const DEFAULT_SORT: ChannelSort = [
  { last_message_at: -1 },
  { updated_at: -1 },
  { cid: 1 },
];

const ChannelList: ChannelListScreen = ({ navigation }) => {
  const { client, userId } = useChatContext();
  const [filters, setFilters] = useState<ChannelFilters>({
    type: 'messaging',
    members: { $in: [userId] },
  });
  const [channels, setChannels] = useState<Channel[]>([]);

  const fetchChannels = async () => {
    const newChannels = await client.queryChannels(filters, DEFAULT_SORT, {
      limit: 12,
    });
    setChannels(newChannels);
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const renderItem: ListRenderItem<Channel> = ({ item }) => (
    <ChannelItem channel={item} />
  );

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader />
      <FlatList
        data={channels}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.data?.cid}`}
        ListHeaderComponent={
          <View>
            <Text>Hedge Funds</Text>
          </View>
        }
      />
    </View>
  );
};

export default ChannelList;

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
