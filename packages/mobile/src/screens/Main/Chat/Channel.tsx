import React, { FC, useRef, useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ListRenderItem,
  StyleSheet,
  FlatList,
  Platform,
  Pressable,
  View,
  Text,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaretLeft, ImageSquare, X } from 'phosphor-react-native';
import {
  Channel as SCChannel,
  ChannelSort,
  FormatMessageResponse as SCMessage,
} from 'stream-chat';
import ImagePicker, {
  ImageOrVideo,
  Image as UploadImage,
} from 'react-native-image-crop-picker';
import FastImage, { ResizeMode, ImageStyle } from 'react-native-fast-image';

import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
dayjs.extend(relativeTime);

import PHeader from 'mobile/src/components/common/PHeader';
import ExpandingInput from 'mobile/src/components/common/ExpandingInput';
import ChatAvatar from 'mobile/src/components/main/chat/ChatAvatar';
import { Body1Bold, Body3, Body2Bold } from 'mobile/src/theme/fonts';
import pStyles from 'mobile/src/theme/pStyles';
import {
  PRIMARYSOLID,
  WHITE,
  WHITE12,
  GRAY600,
  GRAY900,
} from 'shared/src/colors';

import {
  useForm,
  Controller,
  useController,
  DefaultValues,
} from 'react-hook-form';
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
  message?: string;
  images: string[];
};

const schema = yup
  .object({
    images: yup.array(yup.string().required()).default([]),
    message: yup.string().when('images', {
      is: (images: string[]) => images.length === 0,
      then: yup.string().trim().required('Required'),
    }),
  })
  .required();

const Channel: ChannelScreen = ({ navigation, route }) => {
  const { channelId, initialData } = route.params;

  const { client, userId } = useChatContext() || {};
  const channel = useRef(initialData);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState(
    initialData?.state.messages
      ? processMessages(initialData?.state.messages)
      : [],
  );
  const [images, setImages] = useState<{ uri: string; data: ImageOrVideo }[]>(
    [],
  );

  const { members } = channel.current?.state ?? {};
  const users = members
    ? Object.keys(members).filter((key) => key !== userId)
    : [];
  const firstUser = members && users.length > 0 ? members[users[0]].user : null;

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: schema.cast(
      {},
      { assert: false, stripUnknown: true },
    ) as DefaultValues<FormValues>,
  });
  const { field: imagesField } = useController({
    control,
    name: 'images',
  });

  const fetchChannel = useCallback(async () => {
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
  }, [client, channelId]);

  useEffect(() => {
    if (!initialData || channel.current?.cid !== channelId) {
      fetchChannel();
    }
  }, [fetchChannel, initialData, channelId]);

  useEffect(() => {
    if (!channel.current) {
      return;
    }
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
  }, [messages]);

  const renderItem: ListRenderItem<PMessage> = useCallback(
    ({ item }) => (
      <MessageItem
        message={item}
        isMine={item.user?.id === userId}
        isGroupChat={users.length > 2}
      />
    ),
    [userId, users.length],
  );

  if (!client || !userId) {
    // Return error state
    return null;
  }

  const onSubmit = async ({ message }: FormValues): Promise<void> => {
    if (!channel.current) {
      console.log('No channel available.');
      return;
    }

    const attachments =
      images.length === 0
        ? undefined
        : images.map((image) => ({
            image_url: image.uri,
            type: 'image',
          }));

    await channel.current.sendMessage({ text: message, attachments });
    reset(
      schema.cast(
        {},
        { assert: false, stripUnknown: true },
      ) as DefaultValues<FormValues>,
    );
    setImages([]);
  };

  const openPicker = async (): Promise<void> => {
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
      compressImageQuality: 0.8,
    });

    await uploadImage(image);
  };

  const uploadImage = async (image: ImageOrVideo): Promise<void> => {
    if (!channel.current) {
      return;
    }

    setUploading(true);

    const result = await channel.current.sendImage(image.path);
    setImages([...images, { uri: result.file, data: image }]);
    imagesField.onChange([...imagesField.value, result.file]);

    setUploading(false);
  };

  const removeImage = (index: number): void => {
    const newImages = [...images];
    const newValues = [...imagesField.value];

    newImages.splice(index, 1);
    newValues.splice(index, 1);

    imagesField.onChange(newValues);
    setImages(newImages);
  };

  const backToChannelList = (): void => {
    navigation.dispatch(CommonActions.reset({
      index: 1,
      routes: [
        { name: "ChannelList" },
        { name: "Channel", params: route.params}
      ]
    }));
    navigation.goBack();
  }

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
          keyboardDismissMode="interactive"
        />
        <View style={styles.inputContainer}>
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <ExpandingInput
                {...field}
                placeholder="Type a message..."
                containerStyle={styles.input}
                value={field.value}
                onChangeText={field.onChange}
                keyboardAppearance="dark"
                viewAbove={
                  images.length === 0 && !uploading ? undefined : (
                    <View style={styles.imageContainer}>
                      {images.map((image, index) => (
                        <View key={image.uri} style={styles.imageView}>
                          <FastImage
                            style={styles.image}
                            source={{
                              uri: image.uri,
                            }}
                          />
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
            )}
          />
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
    marginBottom: 0,
  },
  inputContainer: {
    position: 'relative',
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
  },
  imageButton: {
    justifyContent: 'center',
    marginHorizontal: 16,
  },
});
