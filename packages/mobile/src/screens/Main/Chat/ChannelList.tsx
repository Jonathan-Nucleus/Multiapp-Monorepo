import React, { useState, useEffect, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';
import retry from 'async-retry';
import { NotePencil } from 'phosphor-react-native';

import MainHeader from 'mobile/src/components/main/Header';
import SearchInput from 'mobile/src/components/common/SearchInput';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE, GRAY700, GRAY600, PRIMARY } from 'shared/src/colors';

import { useForm, Controller, DefaultValues } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useChatContext } from 'mobile/src/context/Chat';
import ChannelItem from 'mobile/src/components/main/chat/ChannelItem';
import { Channel, ChannelSort } from 'mobile/src/services/chat';

import { ChannelListScreen } from 'mobile/src/navigations/ChatStack';
import PSpinner from '../../../components/common/PSpinner';
import { useIsFocused } from '@react-navigation/native';
import PText from '../../../components/common/PText';
import { Body1Semibold, Body2Medium } from '../../../theme/fonts';

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
  const { client, userId, reconnect } = useChatContext() || {};
  const focused = useIsFocused();
  const [retryStatus, setRetryStatus] = useState({ loading: false, count: 0 });

  const [channels, setChannels] = useState<Channel[]>([]);
  const { control, getValues } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: schema.cast(
      {},
      { assert: false },
    ) as DefaultValues<FormValues>,
  });

  const fetchChannels = useCallback(async () => {
    if (!client) {
      console.log('no client');
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

    const newChannels = await retry(
      () =>
        client.queryChannels(filter, DEFAULT_SORT, {
          limit: 12,
          watch: true,
        }),
      {
        onRetry: (error) => {
          reconnect?.();
          console.log('retrying', error);
        },
      },
    );
    setChannels(newChannels);
  }, [client, getValues, userId, reconnect]);

  useEffect(() => {
    if (channelId) {
      navigation.navigate('Channel', {
        channelId,
      });
    }
    if (client) {
      fetchChannels();
      const handler = client.on((event) => {
        console.log('received event in channel list', event.type);
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

  useEffect(() => {
    retryConnect();
  }, [focused, client]);

  const retryConnect = () => {
    if (focused && !client) {
      setRetryStatus({ loading: true, count: 0 });
      setTimeout(
        () => {
          if (!client) {
            setRetryStatus({ loading: false, count: 1 });
          }
        },
        retryStatus.count === 0 ? 3000 : 5000,
      );
    } else {
      setRetryStatus({ loading: false, count: 0 });
    }
  };

  const kavBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

  const renderItem: ListRenderItem<Channel> = ({ item }) => (
    <ChannelItem channel={item} />
  );

  const renderFailure = () => (
    <View style={styles.noClientContainer}>
      {retryStatus.loading ? (
        <View style={styles.spinnerContainer}>
          <PSpinner visible={!client} />
        </View>
      ) : (
        <>
          <PText style={styles.failedLabel}>Messages Failed to Load</PText>
          <TouchableOpacity
            onPress={() => {
              reconnect?.();
              retryConnect();
            }}>
            <PText style={styles.failedButton}>Tap here to try again.</PText>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader />
      {!!client && !!userId ? (
        <>
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
          <KeyboardAvoidingView style={styles.flex} behavior={kavBehavior}>
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
        </>
      ) : (
        renderFailure()
      )}
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

  noClientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    width: 64,
    height: 64,
  },

  failedLabel: {
    color: WHITE,
    ...Body1Semibold,
  },
  failedButton: {
    color: PRIMARY,
    ...Body2Medium,
    marginTop: 8,
    marginBottom: 18,
  },
});
