import React, { FC, useState, useEffect } from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ListRenderItem,
  StyleSheet,
  FlatList,
  View,
  Text,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaretLeft, ImageSquare } from 'phosphor-react-native';
import { CommonActions } from '@react-navigation/native';

import PHeader from 'mobile/src/components/common/PHeader';
import SearchInput from 'mobile/src/components/common/SearchInput';
import PTextInput from 'mobile/src/components/common/PTextInput';
import { Body1Bold, Body2, Body3Bold } from 'mobile/src/theme/fonts';
import pStyles from 'mobile/src/theme/pStyles';
import {
  PRIMARY,
  WHITE,
  WHITE12,
  BGDARK,
  GRAY700,
  GRAY600,
  GRAY900,
} from 'shared/src/colors';

import { useForm, Controller, DefaultValues } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  useChatContext,
  Channel,
  ChannelSort,
  ChannelFilters,
  User,
} from 'mobile/src/context/Chat';
import { findUsers, createChannel } from 'mobile/src/utils/chat';
import UserItem from 'mobile/src/components/main/chat/UserItem';

import { NewChatScreen } from 'mobile/src/navigations/ChatStack';

const DEFAULT_SORT: ChannelSort = [
  { last_message_at: -1 },
  { updated_at: -1 },
  { cid: 1 },
];

type FormValues = {
  search?: string;
  message?: string;
};

const schema = yup
  .object({
    search: yup.string().notRequired().default(''),
    message: yup.string().trim().notRequired().default(''),
  })
  .required();

const NewChat: NewChatScreen = ({ navigation }) => {
  const { client, userId } = useChatContext();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const { control, handleSubmit, reset, getValues } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: schema.cast(
      {},
      { assert: false },
    ) as DefaultValues<FormValues>,
  });

  const performSearch = async () => {
    const searchText = getValues('search') ?? '';
    const users = await findUsers(client, searchText, [
      { last_active: -1 },
      { id: 1 },
    ]);

    if (users) {
      setUsers(users);
    }
  };

  useEffect(() => {
    performSearch();
  }, []);

  const onSubmit = async ({ message }: FormValues) => {
    if (selectedUsers.length === 0) return;

    const members = [userId, ...selectedUsers.map((user) => user.id)];
    const channel = await createChannel(client, members);

    if (message && message !== '') {
      await channel.sendMessage({ text: message });
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'ChannelList' },
          { name: 'Channel', params: { channelId: channel.cid, channel } },
        ],
      }),
    );
  };

  const onSelected = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
  };

  const renderItem: ListRenderItem<User> = ({ item }) => (
    <UserItem user={item} onPress={onSelected} />
  );

  const disableNext = selectedUsers.length === 0;
  return (
    <View style={pStyles.globalContainer}>
      <PHeader
        leftIcon={
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}>
            <CaretLeft size={32} color={WHITE} />
          </Pressable>
        }
        centerIcon={
          <View style={styles.headerTitleContainer} pointerEvents="none">
            <Text style={styles.headerTitle}>Send a Message</Text>
          </View>
        }
        rightIcon={
          <Pressable disabled={disableNext} onPress={handleSubmit(onSubmit)}>
            <Text style={[styles.next, disableNext ? styles.disabled : null]}>
              Next
            </Text>
          </Pressable>
        }
        outerContainerStyle={styles.header}
      />
      <Controller
        name="search"
        control={control}
        render={({ field }) => (
          <SearchInput
            {...field}
            onChangeText={(text) => {
              field.onChange(text);
              performSearch();
            }}
            onClear={() => field.onChange('')}
            containerStyle={styles.textContainerStyle}
            style={styles.textStyle}
            placeholder="Search members"
            placeholderTextColor={GRAY600}
          />
        )}
      />
      {selectedUsers.length > 0 ? (
        <View style={styles.sendingToContainer}>
          <Text style={styles.sendingTo}>Sending to:</Text>
          {selectedUsers.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
          <View style={styles.separator} />
        </View>
      ) : null}
      <FlatList
        data={users.filter(
          (user) => !selectedUsers.some((u) => u.id == user.id),
        )}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <PTextInput
                {...field}
                placeholder="Type a message..."
                label=""
                labelStyle={styles.label}
                subLabelStyle={styles.label}
                textInputStyle={styles.input}
                text={field.value}
                onChangeText={field.onChange}
                onSubmitEditing={handleSubmit(onSubmit)}
                keyboardAppearance="dark"
              />
            )}
          />
          <View style={styles.imageButton}>
            <Pressable
              onPress={() => console.log('open gallery')}
              style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}>
              <ImageSquare size={20} color={WHITE} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default NewChat;

const styles = StyleSheet.create({
  header: {
    borderColor: WHITE12,
    borderBottomWidth: 1,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Body1Bold,
    color: WHITE,
    textAlign: 'center',
  },
  next: {
    color: PRIMARY,
    ...Body1Bold,
  },
  disabled: {
    color: GRAY600,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainerStyle: {
    marginTop: 16,
  },
  textStyle: {
    backgroundColor: GRAY700,
    borderRadius: 16,
    height: 40,
    borderWidth: 0,
    color: WHITE,
  },
  sendingToContainer: {
    marginTop: 16,
  },
  sendingTo: {
    paddingLeft: 16,
    color: WHITE,
    ...Body3Bold,
  },
  label: {
    height: 0,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    paddingLeft: 64,
    marginBottom: 8,
    marginTop: 0,
    borderRadius: 16,
    borderWidth: 0,
    ...Body2,
  },
  imageButton: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 16,
  },
  separator: {
    height: 24,
    backgroundColor: GRAY900,
  },
});
