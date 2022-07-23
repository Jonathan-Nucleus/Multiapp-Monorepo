import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import PLabel from '../../common/PLabel';
import PSpinner from '../../common/PSpinner';
import { WHITE12 } from 'shared/src/colors';
import { Body2Medium } from '../../../theme/fonts';

import { VideoPosted } from '../../../screens/PostDetails/CreatePost/ReviewPost';

const BANNER_HEIGHT = 104;

const VideoProcessingBanner: React.FC = () => {
  const animatedHeight = useRef(new Animated.Value(BANNER_HEIGHT)).current;

  const focused = useIsFocused();
  const [hideBanner, setHideBanner] = useState(true);

  useEffect(() => {
    if (focused) {
      AsyncStorage.getItem(VideoPosted).then((videoPosted) => {
        if (videoPosted === 'true') {
          AsyncStorage.setItem(VideoPosted, 'false');
          setHideBanner(false);
          animatedHeight.setValue(BANNER_HEIGHT);
          setTimeout(() => {
            Animated.spring(animatedHeight, {
              toValue: 0,
              useNativeDriver: false,
              restSpeedThreshold: 100,
              restDisplacementThreshold: 40,
            }).start(() => {
              setHideBanner(true);
            });
          }, 5000);
        }
      });
    }
  }, [focused]);

  if (hideBanner) {
    return null;
  }

  return (
    <Animated.View style={{ height: animatedHeight }}>
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <PSpinner visible={!hideBanner} />
        </View>
        <PLabel
          label={
            'Your video is processing and will be posted to the feed shortly.'
          }
          textStyle={styles.text}
          numberOfLines={2}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    width: 36,
    height: 36,
    marginLeft: 28,
  },

  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: WHITE12,
    borderBottomColor: WHITE12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 28,
    overflow: 'hidden',
  },
  text: {
    marginHorizontal: 16,
    ...Body2Medium,
    lineHeight: 20,
  },
});

export default VideoProcessingBanner;
