import React, { useState, useEffect, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
} from 'react-native';
import { CaretLeft } from 'phosphor-react-native';
import { CommonActions } from '@react-navigation/native';

import PHeader from 'mobile/src/components/common/PHeader';
import SearchInput from 'mobile/src/components/common/SearchInput';
import { Body1Bold, Body2 } from 'mobile/src/theme/fonts';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import pStyles from 'mobile/src/theme/pStyles';
import {
  PRIMARY,
  WHITE,
  WHITE12,
  GRAY700,
  GRAY600,
  GRAY900,
} from 'shared/src/colors';

import { useForm, Controller, DefaultValues } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useChatContext } from 'mobile/src/context/Chat';
import { findUsers, createChannel, User } from 'mobile/src/services/chat';
import UserItem from 'mobile/src/components/main/chat/UserItem';

import { NewChatScreen } from 'mobile/src/navigations/ChatStack';
import SelectedUserItem from '../../../components/main/chat/SelectedUserItem';

type FormValues = {
  search?: string;
};

const schema = yup
  .object({
    search: yup.string().notRequired().default(''),
  })
  .required();

const NewChat: NewChatScreen = ({ navigation }) => {
  const { client, userId } = useChatContext() || {};
  const [groupedUsers, setGroupedUsers] = useState<any>({});
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
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

  const performSearch = useCallback(async () => {
    if (!client) {
      return;
    }

    const searchText = getValues('search') ?? '';
    const searchResults = await findUsers(client, searchText, [
      { last_active: -1 },
      { id: 1 },
    ]);

    if (searchResults) {
      sortUsers(searchResults);
    }
  }, [client, getValues]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  if (!client || !userId) {
    return <PAppContainer noScroll />;
  }

  const sortUsers = (arrUsers: User[]) => {
    if (arrUsers && arrUsers.length) {
      arrUsers.sort((item1: User, item2: User) => {
        return item1.firstName.localeCompare(item2.firstName);
      });

      let objUsers: any = {};
      arrUsers.forEach((item: User) => {
        const firstChar: string = item.firstName.charAt(0).toUpperCase();
        if (firstChar && Number.isNaN(Number.parseInt(firstChar))) {
          if (!objUsers[firstChar]) {
            objUsers[firstChar] = [];
          }
          objUsers[firstChar].push(item);
        }
      });
      setGroupedUsers(objUsers);
    }
  };

  const onSubmit = async (): Promise<void> => {
    if (!client || selectedUsers.length === 0) {
      return;
    }

    const members = [userId, ...selectedUsers.map((user) => user.id)];
    const channel = await createChannel(client, members);

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

  const onSelected = (user: User): void => {
    const userExists: any = selectedUsers.find(
      (selected) => selected.id === user.id,
    );
    !userExists && setSelectedUsers([...selectedUsers, user]);
  };

  const onRemove = (user: User): void => {
    setSelectedUsers([
      ...selectedUsers.filter((selectedUser) => selectedUser.id !== user.id),
    ]);
  };

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
            onClear={() => {
              field.onChange('');
              performSearch();
            }}
            containerStyle={styles.textContainerStyle}
            style={styles.textStyle}
            placeholder="Search members"
            placeholderTextColor={GRAY600}
          />
        )}
      />
      {selectedUsers.length > 0 ? (
        <View style={styles.sendingToContainer}>
          <Text style={styles.sendingTo}>To :</Text>
          <ScrollView
            showsVerticalScrollIndicator={true}
            indicatorStyle={'white'}>
            <View style={styles.selectedUsersWrapper}>
              {selectedUsers.map((user) => (
                <SelectedUserItem
                  key={user.id}
                  user={user}
                  onRemove={onRemove}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      ) : (
        <Text style={styles.sendingTo}>To :</Text>
      )}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.usersWrapper}>
          {Object.keys(groupedUsers).map((letter: any) => {
            return (
              <>
                <View style={styles.sortLetterBox}>
                  <Text style={styles.sortLetter}>{letter}</Text>
                </View>
                {groupedUsers[letter].map((item: any) => {
                  return (
                    <UserItem
                      selectedUsers={selectedUsers}
                      user={item}
                      onPress={onSelected}
                    />
                  );
                })}
              </>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default NewChat;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    display: 'none',
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
  sendingToContainer: {
    maxHeight: '25%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  selectedUsersWrapper: {
    width: '100%',
    display: 'flex',
    overflowY: 'scroll',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  sendingTo: {
    marginTop: 10,
    paddingLeft: 18,
    color: WHITE,
    ...Body2,
  },
  separator: {
    height: 24,
    backgroundColor: GRAY900,
  },
  sortLetterBox: {
    height: 30,
    marginTop: 15,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    color: WHITE,
    backgroundColor: GRAY700,
  },
  sortLetter: {
    marginLeft: 20,
    color: WHITE,
    ...Body2,
  },
  usersWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
});
