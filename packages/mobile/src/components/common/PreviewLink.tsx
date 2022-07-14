import React from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Linking,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import PLabel from 'mobile/src/components/common/PLabel';
import { Body2Bold } from 'mobile/src/theme/fonts';
import { WHITE12 } from 'shared/src/colors';

import { LinkPreview } from 'shared/graphql/query/post/useLinkPreview';

interface PostHeaderProps {
  previewData: LinkPreview;
  containerStyle?: StyleProp<ViewStyle>;
}

const PreviewLink: React.FC<PostHeaderProps> = ({
  previewData,
  containerStyle,
}) => {
  const previewImage = previewData.images?.find((image) => !!image);

  return (
    <TouchableOpacity
      onPress={() => {
        Linking.openURL(previewData.url);
      }}
      style={[styles.containerStyle, containerStyle]}>
      <View style={styles.previewContainer}>
        <View style={styles.metaDataContainer}>
          {previewImage && (
            <FastImage
              source={{ uri: previewImage }}
              style={styles.previewImage}
            />
          )}
          <PLabel label={previewData.title || ''} textStyle={styles.title} />
          <PLabel
            label={previewData.description || ''}
            textStyle={styles.description}
            numberOfLines={2}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    height: 280,
    marginVertical: 16,
    width: '100%',
  },
  previewContainer: {
    overflow: 'hidden',
    flex: 1,
  },
  metaDataContainer: {
    flexDirection: 'column',
    borderColor: WHITE12,
    borderRadius: 8,
    flex: 1,
  },
  title: {
    marginHorizontal: 16,
    marginTop: 16,
    lineHeight: 18,
  },
  description: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    ...Body2Bold,
    lineHeight: 18,
  },
  previewImage: {
    width: '100%',
    flex: 1,
    flexGrow: 1,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    overflow: 'hidden',
  },
});

export default PreviewLink;
