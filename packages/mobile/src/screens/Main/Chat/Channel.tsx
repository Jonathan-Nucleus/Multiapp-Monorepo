import React, {
  FC,
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  KeyboardAvoidingView,
  ListRenderItem,
  StyleSheet,
  FlatList,
  Platform,
  Pressable,
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaretLeft, ImageSquare } from 'phosphor-react-native';
import {
  Channel as SCChannel,
  ChannelSort,
  FormatMessageResponse as SCMessage,
} from 'stream-chat';

import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
dayjs.extend(relativeTime);

import PHeader from 'mobile/src/components/common/PHeader';
import MainHeader from 'mobile/src/components/main/Header';
import PTextInput from 'mobile/src/components/common/PTextInput';
import ChatAvatar from 'mobile/src/components/main/chat/ChatAvatar';
import { Body1Bold, Body2, Body3 } from 'mobile/src/theme/fonts';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE, BGDARK, WHITE12, GRAY600 } from 'shared/src/colors';

import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useChatContext } from 'mobile/src/context/Chat';
import {
  channelName,
  processMessages,
  addMessage,
  PMessage,
} from 'mobile/src/services/chat';
import MessageItem from 'mobile/src/components/main/chat/MessageItem';

import { ChannelScreen } from 'mobile/src/navigations/ChatStack';

type FormValues = {
  message: string;
};

const schema = yup
  .object({
    message: yup.string().trim().required('Required'),
  })
  .required();

const Channel: ChannelScreen = ({ navigation, route }) => {
  const { channelId, initialData } = route.params;

  const { client, userId } = useChatContext();
  const channel = useRef(initialData);
  const [messages, setMessages] = useState(
    initialData?.state.messages
      ? processMessages(initialData?.state.messages)
      : [],
  );

  const { members } = channel.current?.state ?? {};
  const users = members
    ? Object.keys(members).filter((key) => key !== userId)
    : [];
  const firstUser = members && users.length > 0 ? members[users[0]].user : null;

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: { message: '' },
  });

  const fetchChannel = async () => {
    const channelData = (
      await client.queryChannels({
        type: 'messaging',
        cid: channelId,
      })
    )[0];

    channel.current = channelData;
    setMessages(processMessages(channelData.state.messages));
  };

  useEffect(() => {
    if (!initialData) {
      fetchChannel();
    }
  }, []);

  useEffect(() => {
    if (!channel.current) return;
    const listener = channel.current.on((event) => {
      switch (event.type) {
        case 'message.new':
          if (event.message) {
            setMessages(addMessage(event.message, messages));
          }
          break;
      }
    });

    return () => listener.unsubscribe();
  }, [channel.current, messages]);

  const onSubmit = async ({ message }: FormValues) => {
    if (!channel.current) {
      console.log('No channel available.');
      return;
    }

    await channel.current.sendMessage({ text: message });
    reset({ message: '' });
  };

  const renderItem: ListRenderItem<PMessage> = useCallback(
    ({ item }) => (
      <MessageItem
        message={item}
        isMine={item.user?.id === userId}
        finalMessage={item.lastMessage}
      />
    ),
    [userId],
  );

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
          channel.current ? (
            <View style={styles.headerTitleContainer} pointerEvents="none">
              <Text style={styles.headerTitle}>
                {channelName(channel.current, userId)}
              </Text>
              {firstUser?.last_active && (
                <Text style={styles.lastSeen}>
                  {dayjs(firstUser.last_active).fromNow()}
                </Text>
              )}
            </View>
          ) : null
        }
        rightIcon={
          firstUser ? (
            <Pressable
              onPress={() =>
                navigation.navigate('UserDetails', {
                  screen: 'UserProfile',
                  params: {
                    userId: firstUser.id,
                  },
                })
              }
              style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}>
              <ChatAvatar user={firstUser} size={32} onlineStatusSize={10} />
            </Pressable>
          ) : null
        }
        outerContainerStyle={styles.header}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          inverted
          contentContainerStyle={styles.list}
        />
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
                textContainerStyle={styles.textInputContainer}
                textInputStyle={styles.input}
                text={field.value}
                onChangeText={field.onChange}
                onSubmitEditing={handleSubmit(onSubmit)}
                keyboardAppearance="dark"
                multiline={true}
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

export default Channel;

const styles = StyleSheet.create({
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
  lastSeen: {
    ...Body3,
    color: GRAY600,
    marginTop: 4,
  },
  header: {
    borderColor: WHITE12,
    borderBottomWidth: 1,
  },
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 24,
  },
  label: {
    height: 0,
  },
  inputContainer: {
    position: 'relative',
  },
  textInputContainer: {
    marginBottom: 8,
    marginTop: 0,
    borderRadius: 16,
    borderWidth: 0,
  },
  input: {
    paddingLeft: 64,
    paddingRight: 16,
    lineHeight: 18,
    ...Body2,
  },
  imageButton: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 16,
  },
});
