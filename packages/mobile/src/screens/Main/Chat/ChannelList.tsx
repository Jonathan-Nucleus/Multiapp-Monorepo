import React, { ReactElement, useState, useEffect, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import retry from 'async-retry';
import { NotePencil, Trash, Archive, SignOut } from 'phosphor-react-native';
import MainHeader from 'mobile/src/components/main/Header';
import SearchInput from 'mobile/src/components/common/SearchInput';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE, GRAY700, GRAY600, PRIMARY, GRAY800 } from 'shared/src/colors';
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
import { Swipeable } from 'react-native-gesture-handler';
import { PRIMARYSOLID } from '../../../theme/colors';

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
        onRetry: () => {
          reconnect?.();
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

  const retryConnect = (): void => {
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

  const swipeActions = (item: Channel): ReactElement => (
    <>
      <TouchableOpacity
        style={styles.archiveAction}
        onPress={async () => {
          await item.hide();
          fetchChannels();
        }}>
        <Archive size={28} color={WHITE} />
        <Text style={styles.textAction}>Archive</Text>
      </TouchableOpacity>
      {item.data && (item.data as any).member_count > 2 ? (
        <TouchableOpacity
          style={styles.leaveAction}
          onPress={async () => {
            if (userId) {
              await item.removeMembers([userId]);
            }
            fetchChannels();
          }}>
          <SignOut size={28} color={WHITE} />
          <Text style={styles.textAction}>Leave</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.deleteAction}
          onPress={async () => {
            await item.delete();
            fetchChannels();
          }}>
          <Trash size={28} color={WHITE} />
          <Text style={styles.textAction}>Delete</Text>
        </TouchableOpacity>
      )}
    </>
  );

  const renderItem: ListRenderItem<Channel> = ({ item }) => (
    <Swipeable
      renderRightActions={() => swipeActions(item)}
      overshootLeft={false}>
      <ChannelItem channel={item} />
    </Swipeable>
  );

  const renderFailure = (): ReactElement => (
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
          <TouchableOpacity
            style={styles.archivedChat}
            onPress={() => {
              navigation.navigate('ArchivedChats', {
                channels: channels,
              });
            }}>
            <Archive size={28} color={WHITE} />
            <Text style={styles.archivedChatText}>View Archived Chats</Text>
          </TouchableOpacity>
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
  archiveAction: {
    width: 75,
    backgroundColor: PRIMARYSOLID,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteAction: {
    width: 75,
    backgroundColor: GRAY800,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaveAction: {
    width: 75,
    backgroundColor: GRAY800,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textAction: {
    fontSize: 12,
    color: WHITE,
  },
  archivedChat: {
    height: 50,
    marginLeft: 25,
    width: '90%',
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  archivedChatText: {
    marginLeft: 25,
    fontSize: 15,
    color: WHITE,
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
