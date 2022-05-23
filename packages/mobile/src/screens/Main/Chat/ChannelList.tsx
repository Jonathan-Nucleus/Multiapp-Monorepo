import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StyleSheet,
  FlatList,
  View,
} from 'react-native';
import { NotePencil } from 'phosphor-react-native';

import MainHeader from 'mobile/src/components/main/Header';
import SearchInput from 'mobile/src/components/common/SearchInput';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE, GRAY700, GRAY600 } from 'shared/src/colors';

import { useForm, Controller, DefaultValues } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useChatContext } from 'mobile/src/context/Chat';
import ChannelItem from 'mobile/src/components/main/chat/ChannelItem';
import { Channel, ChannelSort, ChannelFilters } from 'mobile/src/services/chat';

import { ChannelListScreen } from 'mobile/src/navigations/ChatStack';

const DEFAULT_SORT: ChannelSort = [
  { last_message_at: -1 },
  { updated_at: -1 },
  { cid: 1 },
];

type FormValues = {
  search?: string;
};

const schema = yup
  .object({
    search: yup.string().notRequired().default(''),
  })
  .required();

const ChannelList: ChannelListScreen = ({ navigation, route }) => {
  const { channelId } = route.params || {};
  const { client, userId } = useChatContext() || {};

  const [channels, setChannels] = useState<Channel[]>([]);
  const { control, handleSubmit, getValues } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: schema.cast(
      {},
      { assert: false },
    ) as DefaultValues<FormValues>,
  });

  const fetchChannels = useCallback(async () => {
    if (!client) {
      return;
    }

    const searchText = getValues('search') ?? '';
    const filter = {
      type: 'messaging',
      members: { $in: userId ? [userId] : [] },
      ...(searchText !== ''
        ? {
            'member.user.name': {
              $autocomplete: searchText,
            },
          }
        : {}),
    };

    const newChannels = await client.queryChannels(filter, DEFAULT_SORT, {
      limit: 12,
      watch: true,
    });
    setChannels(newChannels);
  }, [client, getValues, userId]);

  useEffect(() => {
    if (channelId) {
      navigation.navigate('Channel', {
        channelId,
      });
    }
    if (client) {
      fetchChannels();
      const handler = client.on((event) => {
        const { channel, message, member, user } = event;
        console.log(
          'received event',
          event.type,
          channel,
          message,
          member,
          user,
        );
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
    }
  }, [client, fetchChannels, channelId, navigation]);

  if (!client || !userId) {
    // Return error state
    return <View style={pStyles.globalContainer} />;
  }

  const renderItem: ListRenderItem<Channel> = ({ item }) => (
    <ChannelItem channel={item} />
  );

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader />
      <Controller
        name="search"
        control={control}
        render={({ field }) => (
          <SearchInput
            {...field}
            onChangeText={(text) => {
              field.onChange(text);
              fetchChannels();
            }}
            onClear={() => {
              field.onChange('');
              fetchChannels();
            }}
            containerStyle={styles.textContainerStyle}
            style={styles.textStyle}
            placeholder="Search messages"
            placeholderTextColor={GRAY600}
          />
        )}
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
