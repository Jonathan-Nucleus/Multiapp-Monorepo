import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import retry from 'async-retry';
import React, { useCallback, useEffect, useState } from 'react';
import pStyles from '../../../theme/pStyles';
import PHeader from '../../../components/common/PHeader';
import { GRAY800, PRIMARYSOLID, WHITE, WHITE12 } from 'shared/src/colors';
import { CommonActions } from '@react-navigation/native';
import {
  CaretLeft,
  FolderOpen,
  SignOut,
  Trash,
} from 'phosphor-react-native';
import { Body1, Body1Bold } from '../../../theme/fonts';
import { Channel, ChannelSort } from 'mobile/src/services/chat';
import { ArchivedChatsScreen } from '../../../navigations/ChatStack';
import { Swipeable } from 'react-native-gesture-handler';
import ArchivedItem from '../../../components/main/chat/ArchivedItem';
import { useChatContext } from '../../../context/Chat';

const DEFAULT_SORT: ChannelSort = [
  { last_message_at: -1 },
  { updated_at: -1 },
  { cid: 1 },
];

const ArchivedChats: ArchivedChatsScreen = ({ navigation, route }) => {
  const { client, userId, reconnect } = useChatContext() || {};
  const [archives, setArchives] = useState<Channel[]>([]);

  const fetchArchived = useCallback(async () => {
    if (!client) {
      return;
    }

    const filter = {
      type: 'messaging',
      hidden: { $eq: true },
      members: { $in: userId ? [userId] : [] },
    };

    const newChannels = await retry(
      () =>
        client.queryChannels(filter, DEFAULT_SORT, {
          limit: 12,
          watch: true,
        }),
      {
        onRetry: (_error: any) => {
          reconnect?.();
        },
      },
    );
    setArchives(newChannels);
  }, [client, userId, reconnect]);

  useEffect(() => {
    if (client) {
      fetchArchived();
    }
  }, [client, fetchArchived]);

  const backToChannelList = (): void => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Channel' },
          { name: 'Channel', params: route.params },
        ],
      }),
    );
    navigation.goBack();
  };

  const renderItem: ListRenderItem<Channel> = ({ item }) => (
    <Swipeable
      renderRightActions={() => swipeActions(item)}
      overshootLeft={false}>
      <ArchivedItem channel={item} />
    </Swipeable>
  );

  const swipeActions = (item: any) => (
    <>
      <TouchableOpacity
        style={styles.archiveAction}
        onPress={async () => {
          await item.show();
          fetchArchived();
        }}>
        <FolderOpen size={28} color={WHITE} />
        <Text style={styles.textAction}>Unarchive</Text>
      </TouchableOpacity>
      {item.data.member_count > 2 ? (
        <TouchableOpacity
          style={styles.leaveAction}
          onPress={async () => {
            await item.removeMembers([userId]);
            fetchArchived();
          }}>
          <SignOut size={28} color={WHITE} />
          <Text style={styles.textAction}>Leave</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.deleteAction}
          onPress={async () => {
            await item.delete();
            fetchArchived();
          }}>
          <Trash size={28} color={WHITE} />
          <Text style={styles.textAction}>Delete</Text>
        </TouchableOpacity>
      )}
    </>
  );

  return (
    <View style={pStyles.globalContainer}>
      <PHeader
        leftIcon={
          <Pressable
            onPress={backToChannelList}
            style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}>
            <CaretLeft size={32} color={WHITE} />
          </Pressable>
        }
        centerIcon={
          <View style={styles.headerTitleContainer} pointerEvents="none">
            <Text style={styles.headerText}>Archived Chats</Text>
          </View>
        }
        outerContainerStyle={styles.header}
      />
      <View style={styles.participantsList}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <FlatList
            data={archives}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.data?.cid}`}
          />
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ArchivedChats;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    borderColor: WHITE12,
    borderBottomWidth: 1,
  },
  headerText: {
    ...Body1,
    color: WHITE,
    textAlign: 'center',
  },
  membersText: {
    ...Body1Bold,
    color: WHITE,
    textAlign: 'left',
    paddingLeft: 15,
  },
  headerTitleContainer: {
    flex: 1,
    paddingLeft: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participants: {
    height: 50,
    width: '100%',
    padding: 15,
    ...Body1Bold,
    color: WHITE,
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  participantsList: {
    height: '100%',
  },
  participantsSeparator: {
    borderBottomColor: '#545454',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
  },
  archiveAction: {
    width: 75,
    backgroundColor: PRIMARYSOLID,
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
  deleteAction: {
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
});
