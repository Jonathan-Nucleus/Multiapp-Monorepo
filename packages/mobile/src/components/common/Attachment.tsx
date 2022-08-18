import React, { FC, useState, useEffect } from 'react';
import {
  AppState,
  StyleProp,
  StyleSheet,
  Pressable,
  View,
  Linking,
} from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import { VideoProperties } from 'react-native-video';
import Pinchable from 'react-native-pinchable';
import { S3_BUCKET } from 'react-native-dotenv';

import { Attachment as AttachmentType } from 'shared/graphql/fragments/post';

import VideoPlayer from './VideoPlayer';
import PText from './PText';
import { showMessage } from '../../services/ToastService';
import pStyles from '../../theme/pStyles';
import { BLACK75, WHITE } from 'shared/src/colors';
import { Body2Semibold } from '../../theme/fonts';

interface AttachmentProps {
  attachment: AttachmentType;
  controls?: boolean;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'contain' | 'cover';
  onLoad?: VideoProperties['onLoad'];
  mediaId: string;
  type?: 'post' | 'fund';
  onPress?: () => void;
}

const SUPPORTED_EXTENSION = ['mp4'];

export function isVideo(src: string): boolean {
  if (!src || src === '') {
    return false;
  }
  let filename = src;
  const query = src.indexOf('?');
  if (query >= 0) {
    filename = src.substring(0, query);
  }

  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.') + 1);
  return SUPPORTED_EXTENSION.includes(ext);
}

type UnsubscribeVideoPlaybackStarted = () => void;
type VideoPlaybackStartedHandler = (id: string) => void;

const videoPlaybackStartedSubscribers = new Map<
  string,
  VideoPlaybackStartedHandler
>();

function addVideoStateChangeListener(
  id: string,
  handler: VideoPlaybackStartedHandler,
): UnsubscribeVideoPlaybackStarted {
  videoPlaybackStartedSubscribers.set(id, handler);

  return () => {
    videoPlaybackStartedSubscribers.delete(id);
  };
}

function triggerPlaybackStarted(id: string): void {
  videoPlaybackStartedSubscribers.forEach((callback) => callback(id));
}

export function stopVideos(): void {
  videoPlaybackStartedSubscribers.forEach((callback) => callback('stop-all'));
}

export function stopVideo(id: string): void {
  videoPlaybackStartedSubscribers.get(id)?.('stop-this-video');
}

const Attachment: FC<AttachmentProps> = ({
  mediaId,
  attachment,
  style,
  onLoad,
  controls = true,
  resizeMode = 'cover',
  type = 'post',
  onPress,
}) => {
  const [paused, setPaused] = useState(true);

  const attachmentUrl = `${
    type === 'fund' ? `${S3_BUCKET}/funds` : `${S3_BUCKET}/posts`
  }/${mediaId}/${attachment.url}`;

  const externalMediaId = mediaId ? mediaId.split('/')[0] : null;

  const documentLinkUrl = `${
    type === 'fund' ? null : `${S3_BUCKET}/posts`
  }/${externalMediaId}/${attachment.documentLink}`;

  useEffect(() => {
    if (isVideo(attachment.url)) {
      const appStateSubscription = AppState.addEventListener(
        'change',
        (newState) => {
          if (newState === 'active' || newState === 'background' || !paused) {
            console.log('Pausing video', mediaId);
            setPaused(true);
          }
        },
      );

      const unsubscribe = addVideoStateChangeListener(mediaId, (id) => {
        if (id !== mediaId && !paused) {
          console.log('Pausing video', mediaId);
          setPaused(true);
        }
      });

      return () => {
        unsubscribe();
        appStateSubscription.remove();
      };
    }
  }, [attachment.url, mediaId, paused]);

  const togglePause = (): void => {
    const newState = !paused;
    if (!newState) {
      console.log('Playing video', mediaId);
      triggerPlaybackStarted(mediaId);
    }

    setPaused(newState);
  };

  const openDocumentLink = async (): Promise<void> => {
    if (!documentLinkUrl) {
      return;
    }

    Linking.canOpenURL(documentLinkUrl).then((supported) => {
      if (supported) {
        Linking.openURL(documentLinkUrl);
      } else {
        showMessage('error', 'Whoops! Unable to open the url.');
      }
    });
  };

  // TODO: Need to potentially validate the src url before feeding it to
  // react-native-video as an invalid source seems to crash the app
  return isVideo(attachment.url) && attachment.url ? (
    <Pressable
      onPress={togglePause}
      style={[
        styles.media,
        style,
        { aspectRatio: attachment.aspectRatio },
        attachment.aspectRatio < 1 && resizeMode === 'contain'
          ? styles.contain
          : null,
      ]}>
      <View style={[styles.videoContainer, style]}>
        <VideoPlayer
          key={`${attachment.url}`}
          media={attachment}
          mediaUrl={attachmentUrl}
          onLoad={onLoad}
          paused={paused}
          setPaused={setPaused}
          togglePause={togglePause}
          controls={controls}
        />
      </View>
    </Pressable>
  ) : (
    <Pressable onPress={onPress} disabled={!!attachment.documentLink}>
      <Pressable
        style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}
        onPress={openDocumentLink}
        disabled={!attachment.documentLink}>
        <Pinchable maximumZoomScale={5}>
          <FastImage
            style={[
              styles.media,
              style,
              { aspectRatio: attachment.aspectRatio },
              attachment.aspectRatio < 1 && resizeMode === 'contain'
                ? styles.contain
                : null,
            ]}
            source={{
              uri: attachment.url.includes('/')
                ? attachment.url
                : attachmentUrl,
            }}
            resizeMode={resizeMode}
          />
        </Pinchable>
        {attachment.documentLink ? (
          <View style={styles.pdfTag}>
            <PText style={styles.pdfTagText}>PDF</PText>
          </View>
        ) : null}
      </Pressable>
    </Pressable>
  );
};

type PostAttachmentProps = Omit<AttachmentProps, 'type' | 'mediaId'> & {
  userId: string;
  mediaId?: string;
  onPress?: () => void;
};
export const PostAttachment: FC<PostAttachmentProps> = ({
  mediaId,
  userId,
  onPress,
  ...props
}) => {
  const key = mediaId ? `${userId}/${mediaId}` : userId;
  return <Attachment {...props} type="post" mediaId={key} onPress={onPress} />;
};

type FundMediaProps = Omit<AttachmentProps, 'type'>;
export const FundMedia: FC<FundMediaProps> = (props) => {
  return <Attachment {...props} type="fund" />;
};

type MessageMediaProps = Omit<AttachmentProps, 'type'>;
export const MessageMedia: FC<MessageMediaProps> = (props) => {
  return <Attachment {...props} type="post" />;
};

const styles = StyleSheet.create({
  videoContainer: {
    position: 'relative',
  },
  media: {
    width: '100%',
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  contain: {
    height: '100%',
    width: undefined,
  },
  pdfTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: BLACK75,
  },
  pdfTagText: {
    color: WHITE,
    letterSpacing: 1.125,
    ...Body2Semibold,
  },
});
