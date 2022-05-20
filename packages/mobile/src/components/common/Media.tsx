import React, { FC, useState, useRef } from 'react';
import { StyleProp, StyleSheet, Pressable, View } from 'react-native';
import FastImage, { ResizeMode, ImageStyle } from 'react-native-fast-image';
import Video, { VideoProperties } from 'react-native-video';
import { Play } from 'phosphor-react-native';
import { POST_URL } from 'react-native-dotenv';
import { Media as MediaType } from 'shared/graphql/fragments/post';

import { BLACK75, WHITE60 } from 'shared/src/colors';

interface MediaProps {
  media: MediaType;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'contain' | 'cover';
  onLoad?: VideoProperties['onLoad'];
}

const SUPPORTED_EXTENSION = ['mp4'];

function isVideo(src: string): boolean {
  const ext = src.toLowerCase().substring(src.lastIndexOf('.') + 1);
  return SUPPORTED_EXTENSION.includes(ext);
}

const Media: FC<MediaProps> = ({
  media,
  style,
  onLoad,
  resizeMode = 'cover',
}) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const player = useRef<Video | null>(null);

  const playVideo = (): void => {
    if (!isFirstLoad) {
      return;
    }

    player.current?.seek(0);
    setIsFirstLoad(false);
  };

  const onVideoEnd = (): void => {
    setIsFirstLoad(true);
  };

  // TODO: Need to potentially validate the src url before feeding it to
  // react-native-video as an invalid source seems to crash the app
  return isVideo(media.url) ? (
    <Pressable
      onPress={playVideo}
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
            uri: media.url.includes('/')
              ? media.url
              : `${POST_URL}/${media.url}`,
          }}
          resizeMode={resizeMode}
          onLoad={onLoad}
          onError={(err) => console.log('error', err)}
          onEnd={onVideoEnd}
          controls={true}
          ignoreSilentSwitch="ignore"
          paused={isFirstLoad}
          repeat={false}
          style={{ aspectRatio: media.aspectRatio }}
        />
        {isFirstLoad && (
          <View style={styles.overlay} pointerEvents="none">
            <View style={styles.playbackButton}>
              <Play color={WHITE60} size={24} />
            </View>
          </View>
        )}
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
        uri: media.url.includes('/') ? media.url : `${POST_URL}/${media.url}`,
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
