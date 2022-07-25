import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { getVideoIdFromYoutubeLink } from '../../../../shared/src/url-utils';

interface YoutubePlayerProps {
  videoLink: string;
}

const YoutubePlayer: React.FC<YoutubePlayerProps> = (props) => {
  const { videoLink } = props;
  const id = getVideoIdFromYoutubeLink(videoLink);

  return (
    <WebView
      scrollEnabled={false}
      style={styles.webView}
      source={{
        html: `<iframe frameBorder="0" width=100%" height="100%"src="https://www.youtube.com/embed/${id}?autoplay=0"></iframe>`,
      }}
    />
  );
};
const styles = StyleSheet.create({
  webView: {
    margin: -4,
    width: '100%',
    aspectRatio: 16 / 9, //recommended aspect ratio from youtube
  },
});

export default YoutubePlayer;
