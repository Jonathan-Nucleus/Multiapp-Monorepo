import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StyleSheet,
  FlatList,
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MagnifyingGlass, NotePencil } from 'phosphor-react-native';

import MainHeader from 'mobile/src/components/main/Header';
import SearchInput from 'mobile/src/components/common/SearchInput';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import { Body1, Body2, Body3 } from 'mobile/src/theme/fonts';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE, BGDARK, GRAY700, GRAY600 } from 'shared/src/colors';

import { useChatContext } from 'mobile/src/context/Chat';
import ChannelItem from 'mobile/src/components/main/chat/ChannelItem';
import { Channel, ChannelSort, ChannelFilters } from 'mobile/src/services/chat';

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
  const [search, setSearch] = useState('');

  const fetchChannels = useCallback(async () => {
    const newChannels = await client.queryChannels(filters, DEFAULT_SORT, {
      limit: 12,
      watch: true,
    });
    setChannels(newChannels);
  }, [client, filters]);

  useEffect(() => {
    fetchChannels();
    const handler = client.on((event) => {
      const { channel, message, member, user } = event;
      console.log('received event', event.type, channel, message, member, user);
      switch (event.type) {
        case 'user.watching.start':
        case 'user.watching.stop':
        case 'message.new':
        case 'notification.added_to_channel':
          fetchChannels();
          break;
      }
    });

    return () => handler.unsubscribe();
  }, [client, fetchChannels]);

  const renderItem: ListRenderItem<Channel> = ({ item }) => (
    <ChannelItem channel={item} />
  );

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader />
      <SearchInput
        value={search}
        onChangeText={setSearch}
        onClear={() => setSearch('')}
        containerStyle={styles.textContainerStyle}
        style={styles.textStyle}
        placeholder="Search messages"
        placeholderTextColor={GRAY600}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          data={channels}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.data?.cid}`}
        />
      </KeyboardAvoidingView>
      <PGradientButton
        icon={<NotePencil color={WHITE} size={24} />}
        btnContainer={styles.chatButton}
        gradientContainer={styles.gradientContainer}
        textStyle={styles.chatLabel}
        onPress={() => navigation.navigate('NewChat')}
      />
    </View>
  );
};

export default ChannelList;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  textContainerStyle: {
    marginVertical: 16,
  },
  textStyle: {
    backgroundColor: GRAY700,
    borderRadius: 16,
    height: 40,
    borderWidth: 0,
    color: WHITE,
  },
  chatButton: {
    position: 'absolute',
    bottom: 22,
    right: 22,
  },
  gradientContainer: {
    width: 56,
    height: 56,
    paddingVertical: 0,
  },
  chatLabel: {
    fontSize: 40,
    textAlign: 'center',
  },
});
