import React, { FC, useState, useEffect, useRef } from 'react';
import { StyleProp, StyleSheet, Pressable, View } from 'react-native';
import FastImage, { ResizeMode, ImageStyle } from 'react-native-fast-image';
import Video, { VideoProperties } from 'react-native-video';
import { Media as MediaType } from 'shared/graphql/fragments/post';

import { useAccountContext } from 'shared/context/Account';
import { postsUrl } from 'mobile/src/utils/env';

import { BLACK75, WHITE60 } from 'shared/src/colors';

interface MediaProps {
  media: MediaType;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'contain' | 'cover';
  onLoad?: VideoProperties['onLoad'];
  mediaId?: string;
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
  resizeMode = 'cover',
}) => {
  const account = useAccountContext();
  const [paused, setPaused] = useState(true);
  const player = useRef<Video | null>(null);

  const mediaKey = mediaId ? `${account._id}/${mediaId}` : account._id;
  const mediaUrl = `${postsUrl()}/${mediaKey}/${media.url}`;

  useEffect(() => {
    if (isVideo(media.url)) {
      const unsubscribe = addVideoStateChangeListener(mediaKey, (id) => {
        if (id !== mediaKey) {
          setPaused(true);
        }
      });

      return () => {
        unsubscribe();
        setPaused(true);
      };
    }
  }, [media.url, mediaKey]);

  const togglePause = (): void => {
    const newState = !paused;
    if (!newState) {
      triggerPlaybackStarted(mediaKey);
    }

    setPaused(newState);
  };

  const onVideoEnd = (): void => {
    player.current?.seek(0);
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
        <Video
          ref={(ref) => (player.current = ref)}
          source={{
            uri: media.url.includes('/') ? media.url : mediaUrl,
          }}
          resizeMode={resizeMode}
          onLoad={onLoad}
          onError={(err) => console.log('error', err)}
          onEnd={onVideoEnd}
          controls={true}
          onSeek={(data) => {
            if (data.seekTime === 0) {
              setPaused(true);
            }
          }}
          ignoreSilentSwitch="ignore"
          paused={paused}
          repeat={false}
          style={{ aspectRatio: media.aspectRatio }}
        />
      </View>
    </Pressable>
  ) : (
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
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLACK75,
  },
  playbackButton: {
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: WHITE60,
    borderRadius: 40,
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
});

export default Media;
