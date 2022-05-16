import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  getPreviewData,
  PreviewData,
} from '@flyerhq/react-native-link-preview';
import FastImage from 'react-native-fast-image';

import PLabel from 'mobile/src/components/common/PLabel';

import { Body2Bold } from 'mobile/src/theme/fonts';
import { WHITE12 } from 'shared/src/colors';

interface PostHeaderProps {
  body: string;
}

const PreviewLink: React.FC<PostHeaderProps> = ({ body }) => {
  const [dataPreview, setDataPreview] = useState<PreviewData>();
  useEffect(() => {
    const getData = async () => {
      const data: PreviewData = await getPreviewData(body);
      setDataPreview(data.title ? data : undefined);
    };

    getData();
  }, [body]);

  if (!dataPreview) {
    return null;
  }

  return (
    <View style={styles.previewContainer}>
      <View style={styles.metaDataContainer}>
        <FastImage
          source={{ uri: dataPreview?.image?.url }}
          style={styles.previewImage}
        />
        <PLabel label={dataPreview?.title || ''} textStyle={styles.title} />
        <PLabel
          label={dataPreview?.description || ''}
          textStyle={styles.description}
          numberOfLines={2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    overflow: 'hidden',
    marginVertical: 16,
    height: 224,
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
