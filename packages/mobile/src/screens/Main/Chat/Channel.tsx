import React, {
  ReactElement,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Pressable,
  View,
  Text,
  ScrollView,
} from 'react-native';
import retry from 'async-retry';
import { CommonActions } from '@react-navigation/native';
import { CaretLeft, ImageSquare, X } from 'phosphor-react-native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import { useFocusEffect } from '@react-navigation/native';

import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
dayjs.extend(relativeTime);

import PHeader from 'mobile/src/components/common/PHeader';
import ExpandingInput, {
  User,
  OnSelectUser,
} from 'mobile/src/components/common/ExpandingInput';
import MentionsList from 'mobile/src/components/main/MentionsList';
import MessageItem from 'mobile/src/components/main/chat/MessageItem';
import ChatAvatar from 'mobile/src/components/main/chat/ChatAvatar';
import {
  isVideo,
  stopVideos,
  MessageMedia,
} from 'mobile/src/components/common/Attachment';
import { Body1Bold, Body3, Body2Bold } from 'mobile/src/theme/fonts';
import pStyles from 'mobile/src/theme/pStyles';
import {
  PRIMARYSOLID,
  WHITE,
  WHITE12,
  GRAY600,
  GRAY900,
} from 'shared/src/colors';

import { useForm, useController, DefaultValues } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useChatContext } from 'mobile/src/context/Chat';
import { useAccountContext } from 'shared/context/Account';
import {
  channelName,
  processMessages,
  addMessage,
  Message,
  PMessage,
} from 'mobile/src/services/chat';

import { ChannelScreen } from 'mobile/src/navigations/ChatStack';
import InfoIcon from '../../../assets/icons/info.svg';
import DateSeparator from '../../../components/main/chat/DateSeparator';

type FormValues = {
  message?: string;
  media: string[];
};

const schema = yup
  .object({
    media: yup.array(yup.string().required()).default([]),
    message: yup.string().when('media', {
      is: (media: string[]) => media.length === 0,
      then: yup.string().trim().required('Required'),
    }),
  })
  .required();

const Channel: ChannelScreen = ({ navigation, route }) => {
  const { channelId, initialData } = route.params;

  const { client, reconnect } = useChatContext() || {};
  const { _id: userId } = useAccountContext();
  const channel = useRef(initialData);
  const [uploading, setUploading] = useState(false);
  const [isStale, setStale] = useState(!initialData);
  const [messages, setMessages] = useState(
    initialData?.state.messages
      ? processMessages(initialData?.state.messages)
      : [],
  );
  const [groupedMessageSource, setGroupedMessageSource] = useState<
    Record<string, PMessage[]>
  >({});
  const [media, setMedia] = useState<{ uri: string; data: ImageOrVideo }[]>([]);
  const [mentionUsers, setMentionUsers] = useState<User[]>([]);
  const [refreshData, setRefreshData] = useState<boolean>(false);
  const onMentionSelected = useRef<OnSelectUser>();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  if (!isStale && !client) {
    setStale(true);
  }

  useEffect(() => {
    groupMessage(messages);
  }, [messages, messages.length]);

  useFocusEffect(() => () => {
    stopVideos();
  });

  const { members } = channel.current?.state ?? {};

  const users = members
    ? Object.keys(members).filter((key) => key !== userId)
    : [];

  const userInfos = users.map((userID) => {
    return members?.[userID].user;
  });

  const additionalUsers = users.length > 2 ? ` + ${users.length - 2}` : '';
  const firstUser = members && users.length > 0 ? members[users[0]].user : null;

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: schema.cast(
      {},
      { assert: false, stripUnknown: true },
    ) as DefaultValues<FormValues>,
  });
  const { field: mediaField } = useController({
    control,
    name: 'media',
  });

  const fetchChannel = useCallback(async () => {
    await retry(
      async () => {
        if (client) {
          const channelData = (
            await client.queryChannels({
              type: 'messaging',
              cid: channelId,
            })
          )[0];

          channel.current = channelData;
          setMessages(processMessages(channelData.state.messages));
        }
      },
      {
        onRetry: (_error) => {
          reconnect?.();
        },
      },
    );
  }, [client, channelId, reconnect]);

  useEffect(() => {
    if (
      !initialData ||
      initialData.state.messages.length === 0 ||
      channel.current?.cid !== channelId ||
      isStale
    ) {
      fetchChannel();
    }
  }, [fetchChannel, initialData, channelId, client]);

  useEffect(() => {
    if (!channel.current) {
      return;
    }

    channel.current.markRead();
    const listener = channel.current.on((event) => {
      switch (event.type) {
        case 'message.new':
          if (event.message) {
            setMessages(addMessage(event.message, messages));
          }
          break;

        case 'message.updated':
          if (event.message) {
            const updatedMessages: Message[] = messages.reverse();
            const index = updatedMessages.findIndex(
              (message) => message.id === event.message?.id,
            );
            updatedMessages[index] = event.message;
            setMessages(processMessages(updatedMessages));
          }
          break;
      }
    });

    return () => listener.unsubscribe();
  }, [messages]);

  const groupMessage = (arrMessage: PMessage[]): void => {
    const groupedSource: Record<string, PMessage[]> = {};
    arrMessage.forEach((message) => {
      const groupStr: string = getDateStr(message.created_at);
      if (!groupedSource[groupStr]) {
        groupedSource[groupStr] = [];
      }
      groupedSource[groupStr].push(message);
    });
    setGroupedMessageSource(groupedSource);
    setRefreshData(true);
  };

  const getDateStr = (date: any): string => {
    if (date instanceof Date) {
      if (isTodayDate(date)) {
        return 'Today';
      } else if (isYestedayDate(date)) {
        return 'Yesterday';
      }
      return getDateString(date);
    } else if (date.length > 10) {
      try {
        const dt = date.substring(0, 10);
        const arrVal = dt.split('-');
        const dateVal = new Date();
        dateVal.setFullYear(Number.parseInt(arrVal[0], 10));
        dateVal.setMonth(Number.parseInt(arrVal[1], 10) - 1);
        dateVal.setDate(Number.parseInt(arrVal[2], 10));
        const today = new Date();
        if (today < dateVal) {
          dateVal.setDate(dateVal.getDate() - 1);
        }
        return getDateStr(dateVal);
      } catch (e) {}
    }
    return 'undefined';
  };

  const isTodayDate = (date: Date): boolean => {
    const today: Date = new Date();
    if (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    ) {
      return true;
    }
    return false;
  };

  const isYestedayDate = (date: Date): boolean => {
    const yesteday = new Date();
    yesteday.setDate(yesteday.getDate() - 1);
    if (
      yesteday.getFullYear() === date.getFullYear() &&
      yesteday.getMonth() === date.getMonth() &&
      yesteday.getDate() === date.getDate()
    ) {
      return true;
    }
    return false;
  };

  const getDateString = (date: Date): string => {
    const today = new Date();
    const thisYear = today.getFullYear();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    if (thisYear === year) {
      return months[month] + ' ' + day;
    }
    return months[month] + ' ' + day + ', ' + year;
  };

  // const onViewableItemsChanged = useCallback<
  //   Exclude<FlatListProps<PMessage>['onViewableItemsChanged'], null | undefined>
  // >(({ changed }) => {
  //   changed.forEach((token) => {
  //     const item = token.item as PMessage;
  //     if (!token.isViewable && item.attachments) {
  //       item.attachments.forEach((attachment, index) => {
  //         stopVideo(`${item.id}-${index}`);
  //       });
  //     }
  //     !token.isViewable && stopVideo(token.key);
  //   });
  // }, []);

  const onSubmit = async ({ message }: FormValues): Promise<void> => {
    const { current: chatChannel } = channel;
    if (!chatChannel) {
      return;
    }

    const attachments =
      media.length === 0
        ? undefined
        : media.map((image) => ({
            image_url: image.uri,
            type: isVideo(image.uri) ? 'video' : 'image',
          }));

    retry(
      async () => {
        await chatChannel.sendMessage({
          text: message,
          attachments,
        });
      },
      {
        onRetry: (_error) => {
          reconnect?.();
        },
      },
    );

    reset(
      schema.cast(
        {},
        { assert: false, stripUnknown: true },
      ) as DefaultValues<FormValues>,
    );
    setMedia([]);
  };

  const openPicker = async (): Promise<void> => {
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
      compressImageQuality: 0.8,
      compressVideoPreset: '1920x1080',
    });

    await uploadImage(image);
  };

  const uploadImage = async (mediaFile: ImageOrVideo): Promise<void> => {
    if (!channel.current) {
      return;
    }

    setUploading(true);

    const result = isVideo(mediaFile.path)
      ? await channel.current.sendFile(mediaFile.path)
      : await channel.current.sendImage(mediaFile.path);

    setMedia([...media, { uri: result.file, data: mediaFile }]);
    mediaField.onChange([...mediaField.value, result.file]);

    setUploading(false);
  };

  const removeImage = (index: number): void => {
    const newImages = [...media];
    const newValues = [...mediaField.value];

    newImages.splice(index, 1);
    newValues.splice(index, 1);

    mediaField.onChange(newValues);
    setMedia(newImages);
  };

  const backToChannelList = (): void => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'ChannelList' },
          { name: 'Channel', params: route.params },
        ],
      }),
    );
    navigation.goBack();
  };

  let arrGroupedCat = Object.keys(groupedMessageSource);
  arrGroupedCat = arrGroupedCat.reverse();

  const groupedTxt = arrGroupedCat.map((groupStr) => {
    let reversed = groupedMessageSource[groupStr];
    if (refreshData) {
      setRefreshData(false);
      reversed = groupedMessageSource[groupStr].reverse();
    }
    return (
      <>
        <DateSeparator date={groupStr} />
        {reversed.map((item) => {
          return (
            <MessageItem
              key={item.id}
              message={item}
              isMine={item.user?.id === userId}
              isGroupChat={users.length > 2}
            />
          );
        })}
      </>
    );
  });

  const navigate = (): void => {
    if (!firstUser) {
      return;
    }

    navigation.navigate('UserDetails', {
      screen: 'UserProfile',
      params: {
        userId: firstUser.id,
      },
    });
  };

  const headerDetails = (): ReactElement | null => {
    if (!channel.current) {
      return null;
    }

    return (
      <>
        <View style={styles.headerTitleContainer} pointerEvents="none">
          <Text style={styles.headerTitle}>
            {users.length > 1
              ? channelName(channel.current, userId).substring(0, 20) +
                `...${additionalUsers}`
              : channelName(channel.current, userId)}
          </Text>
          {firstUser?.last_active && (
            <Text style={styles.lastSeen}>
              {dayjs(firstUser.last_active).fromNow()}
            </Text>
          )}
        </View>
      </>
    );
  };

  const channelHeaderFormat = (): ReactElement | null => {
    if (users.length > 1) {
      return headerDetails();
    } else {
      return (
        <Pressable
          onPress={navigate}
          style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}>
          {headerDetails()}
        </Pressable>
      );
    }
  };

  const channelHeader = (): ReactElement => {
    if (channel.current && firstUser) {
      return (
        <View style={styles.profileInfo}>
          <Pressable
            onPress={navigate}
            style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}>
            <ChatAvatar user={firstUser} size={32} onlineStatusSize={10} />
          </Pressable>
          {channelHeaderFormat()}
        </View>
      );
    } else {
      return <View />;
    }
  };

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
        centerIcon={channelHeader()}
        rightIcon={
          <Pressable
            onPress={() => {
              navigation.navigate('ChannelInfo', {
                usersNo: users.length,
                userInfos: userInfos,
                channel: channel,
                userId: userId,
              });
            }}>
            <InfoIcon />
          </Pressable>
        }
        outerContainerStyle={styles.header}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef?.current?.scrollToEnd({ animated: true });
          }}>
          {groupedTxt}
        </ScrollView>

        <View style={styles.mentionContainer}>
          <MentionsList
            users={mentionUsers}
            onPress={(user) => onMentionSelected.current?.(user)}
          />
        </View>
        <ExpandingInput
          name="message"
          control={control}
          placeholder="Type a message..."
          containerStyle={styles.input}
          renderUsers={(userList, onSelected) => {
            setMentionUsers(userList);
            onMentionSelected.current = onSelected;
          }}
          viewAbove={
            media.length === 0 && !uploading ? undefined : (
              <View style={styles.imageContainer}>
                {media.map((image, index) => (
                  <View key={image.uri} style={styles.imageView}>
                    {isVideo(image.uri) ? (
                      <MessageMedia
                        mediaId={`video-${index}`}
                        attachment={{ url: image.uri, aspectRatio: 1 }}
                        style={styles.video}
                      />
                    ) : (
                      <FastImage
                        style={styles.image}
                        source={{
                          uri: image.uri,
                        }}
                      />
                    )}
                    <Pressable
                      style={styles.removeImage}
                      onPress={() => removeImage(index)}>
                      <X size={24} color={WHITE} />
                    </Pressable>
                  </View>
                ))}
                {uploading ? (
                  <View style={styles.imageView}>
                    <ActivityIndicator
                      size="small"
                      color={WHITE}
                      animating={true}
                      style={styles.flex}
                    />
                  </View>
                ) : null}
              </View>
            )
          }
          viewLeft={
            <View style={styles.imageButton}>
              <Pressable
                onPress={openPicker}
                style={({ pressed }) =>
                  pressed ? pStyles.pressedStyle : null
                }>
                <ImageSquare size={20} color={WHITE} />
              </Pressable>
            </View>
          }
          viewRight={
            <View style={styles.sendButton}>
              <Pressable
                onPress={handleSubmit(onSubmit)}
                style={({ pressed }) =>
                  pressed ? pStyles.pressedStyle : null
                }>
                <Text style={styles.sendText}>Send</Text>
              </Pressable>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Channel;

const styles = StyleSheet.create({
  mentionContainer: {
    position: 'relative',
    height: 0,
  },
  headerTitleContainer: {
    flex: 1,
    paddingLeft: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  headerTitle: {
    ...Body1Bold,
    color: WHITE,
    textAlign: 'center',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
  imageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  imageView: {
    width: 72,
    height: 72,
    margin: 4,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: GRAY900,
  },
  image: {
    flex: 1,
  },
  video: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginVertical: 0,
  },
  removeImage: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  sendButton: {
    marginHorizontal: 8,
    justifyContent: 'flex-start',
    height: '100%',
  },
  sendText: {
    color: PRIMARYSOLID,
    ...Body2Bold,
    padding: 8,
  },
  input: {
    margin: 16,
    maxHeight: 180,
  },
  imageButton: {
    justifyContent: 'center',
    marginHorizontal: 16,
  },
});
