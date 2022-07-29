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

import { Media as MediaType } from 'shared/graphql/fragments/post';

import ExtendedMedia from './ExtendedMedia';
import PText from './PText';
import { showMessage } from '../../services/ToastService';
import pStyles from '../../theme/pStyles';
import { BLACK75, WHITE } from 'shared/src/colors';
import { Body2Semibold } from '../../theme/fonts';

interface MediaProps {
  media: MediaType;
  controls?: boolean;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'contain' | 'cover';
  onLoad?: VideoProperties['onLoad'];
  mediaId: string;
  type?: 'post' | 'fund';
}

const SUPPORTED_EXTENSION = ['mp4'];

export function isVideo(src: string): boolean {
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

const Media: FC<MediaProps> = ({
  mediaId,
  media,
  style,
  onLoad,
  controls = true,
  resizeMode = 'cover',
  type = 'post',
}) => {
  const [paused, setPaused] = useState(true);

  const mediaUrl = `${
    type === 'fund' ? `${S3_BUCKET}/funds` : `${S3_BUCKET}/posts`
  }/${mediaId}/${media.url}`;

  const externalMediaId = mediaId ? mediaId.split('/')[0] : null;

  const documentLinkUrl = `${
    type === 'fund' ? null : `${S3_BUCKET}/posts`
  }/${externalMediaId}/${media.documentLink}`;

  useEffect(() => {
    if (isVideo(media.url)) {
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
  }, [media.url, mediaId, paused]);

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
  return isVideo(media.url) ? (
    <Pressable
      onPress={togglePause}
      style={[
        styles.media,
        style,
        { aspectRatio: media.aspectRatio },
        media.aspectRatio < 1 && resizeMode === 'contain'
          ? styles.contain
          : null,
      ]}>
      <View style={[styles.videoContainer, style]}>
        <ExtendedMedia
          key={`${media.url}`}
          media={media}
          mediaUrl={mediaUrl}
          onLoad={onLoad}
          paused={paused}
          setPaused={setPaused}
          togglePause={togglePause}
          controls={controls}
        />
      </View>
    </Pressable>
  ) : (
    <Pressable
      style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}
      onPress={openDocumentLink}
      disabled={!media.documentLink}>
      <Pinchable maximumZoomScale={5}>
        <FastImage
          style={[
            styles.media,
            style,
            { aspectRatio: media.aspectRatio },
            media.aspectRatio < 1 && resizeMode === 'contain'
              ? styles.contain
              : null,
          ]}
          source={{
            uri: media.url.includes('/') ? media.url : mediaUrl,
          }}
          resizeMode={resizeMode}
        />
      </Pinchable>
      {media.documentLink ? (
        <View style={styles.pdfTag}>
          <PText style={styles.pdfTagText}>PDF</PText>
        </View>
      ) : null}
    </Pressable>
  );
};

type PostMediaProps = Omit<MediaProps, 'type' | 'mediaId'> & {
  userId: string;
  mediaId?: string;
};
export const PostMedia: FC<PostMediaProps> = ({
  mediaId,
  userId,
  ...props
}) => {
  const key = mediaId ? `${userId}/${mediaId}` : userId;
  return <Media {...props} type="post" mediaId={key} />;
};

type FundMediaProps = Omit<MediaProps, 'type'>;
export const FundMedia: FC<FundMediaProps> = (props) => {
  return <Media {...props} type="fund" />;
};

type MessageMediaProps = Omit<MediaProps, 'type'>;
export const MessageMedia: FC<MessageMediaProps> = (props) => {
  return <Media {...props} type="post" />;
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
