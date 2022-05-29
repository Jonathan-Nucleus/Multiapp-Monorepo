import React, { useState } from 'react';
import { StyleSheet, Text, View, Linking, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import dayjs from 'dayjs';

import { MessageMedia } from 'mobile/src/components/common/Media';
import FullScreenImageModal from 'mobile/src/components/common/FullScreenImageModal';
import PBodyText from 'mobile/src/components/common/PBodyText';
import { WHITE, PRIMARYSOLID, GRAY700, GRAY600 } from 'shared/src/colors';
import { Body2, Body4Thin } from 'mobile/src/theme/fonts';

import { PMessage } from 'mobile/src/services/chat';
import ChatAvatar from 'mobile/src/components/main/chat/ChatAvatar';

interface MessageItemProps {
  message: PMessage;
  isMine: boolean;
  isGroupChat?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isMine,
  isGroupChat = false,
}) => {
  const { created_at, attachments, lastMessage, firstMessage } = message;
  const [modalImage, setModalImage] = useState<string>();
  const [isClosing, setClosing] = useState(false);

  const goToUrl = (url: string): void => {
    Linking.openURL(url);
  };

  const closeModal = (): void => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setModalImage(undefined);
    }, 500);
  };

  return (
    <>
      <View
        style={[
          styles.row,
          styles.container,
          isMine ? styles.justifyEnd : styles.justifyStart,
          lastMessage ? styles.finalMessage : null,
        ]}>
        {lastMessage && !isMine && message.user && (
          <ChatAvatar
            user={message.user}
            size={32}
            showOnlineStatus={false}
            style={styles.avatar}
          />
        )}
        <View
          style={[styles.message, !lastMessage ? styles.avatarSpacer : null]}>
          {isGroupChat && firstMessage && !isMine ? (
            <Text
              style={
                styles.info
              }>{`${message.user.firstName} ${message.user.lastName}`}</Text>
          ) : null}
          {message.text ? (
            <View
              style={[
                styles.messageBubble,
                isMine ? styles.myMessage : styles.theirMessage,
                attachments ? styles.messageSpacer : null,
              ]}>
              <PBodyText
                style={styles.messageText}
                body={message.text}
                collapseLongText={false}
                hideLinkPreview={true}
              />
            </View>
          ) : null}
          {attachments && attachments.length > 0 ? (
            <View
              style={[
                styles.imageContainer,
                isMine ? styles.flexEnd : null,
                lastMessage ? styles.messageSpacer : null,
              ]}>
              {attachments.map((attachment, index) => {
                const { image_url } = attachment;
                if (!image_url) {
                  return null;
                }

                const media =
                  attachment.type === 'video' ? (
                    <MessageMedia
                      mediaId={`${message.id}-${index}`}
                      media={{ url: image_url, aspectRatio: 1 }}
                    />
                  ) : (
                    <FastImage
                      key={image_url}
                      style={styles.image}
                      source={{
                        uri: image_url,
                      }}
                    />
                  );

                const titleLink = attachment.title_link;
                return titleLink ? (
                  <Pressable
                    onPress={() => goToUrl(titleLink)}
                    style={styles.image}>
                    {media}
                  </Pressable>
                ) : attachment.type === 'image' ? (
                  <Pressable
                    onPress={() => setModalImage(image_url)}
                    style={styles.image}>
                    {media}
                  </Pressable>
                ) : (
                  media
                );
              })}
            </View>
          ) : null}
          {lastMessage && (
            <View
              style={[
                styles.row,
                isMine ? styles.justifyEnd : styles.justifyStart,
              ]}>
              <Text style={styles.info}>
                {dayjs(created_at).format('h:mmA')}
              </Text>
            </View>
          )}
        </View>
      </View>
      {modalImage ? (
        <FullScreenImageModal
          isVisible={!isClosing}
          onClose={closeModal}
          url={modalImage}
        />
      ) : null}
    </>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  finalMessage: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  flexEnd: {
    alignSelf: 'flex-end',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  message: {
    maxWidth: '75%',
  },
  messageText: {
    color: WHITE,
    lineHeight: 20,
    ...Body2,
  },
  messageSpacer: {
    marginBottom: 8,
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  myMessage: {
    backgroundColor: PRIMARYSOLID,
    borderBottomRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: GRAY700,
    borderBottomLeftRadius: 0,
  },
  imageContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    flexWrap: 'wrap',
    maxWidth: 210,
  },
  image: {
    flexBasis: 100,
    flex: 1,
    height: 100,
    margin: 1,
  },
  avatarSpacer: {
    marginLeft: 44,
  },
  avatar: {
    marginRight: 12,
    marginBottom: 18,
  },
  info: {
    marginBottom: 4,
    marginTop: -2,
    height: 12,
    color: GRAY600,
    ...Body4Thin,
  },
});
