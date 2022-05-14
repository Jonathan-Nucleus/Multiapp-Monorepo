import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import FastImage from 'react-native-fast-image';

import PLabel from 'mobile/src/components/common/PLabel';

import { Body2Bold } from 'mobile/src/theme/fonts';
import { WHITE12 } from 'shared/src/colors';

interface PostHeaderProps {
  body: string;
}

const PreviewLink: React.FC<PostHeaderProps> = (props) => {
  const { body } = props;

  return (
    <LinkPreview
      containerStyle={styles.previewContainer}
      renderLinkPreview={({ previewData }) => (
        <View style={styles.metaDataContainer}>
          <FastImage
            source={{ uri: previewData?.image?.url }}
            style={styles.previewImage}
          />
          <PLabel label={previewData?.title || ''} textStyle={styles.title} />
          <PLabel
            label={previewData?.description || ''}
            textStyle={styles.description}
            numberOfLines={2}
          />
        </View>
      )}
      text={body || ''}
    />
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    overflow: 'hidden',
    marginVertical: 16,
  },
  metaDataContainer: {
    flexDirection: 'column',
    borderColor: WHITE12,
    borderRadius: 8,
    marginTop: 24,
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
    height: 200,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    overflow: 'hidden',
  },
});

export default PreviewLink;
