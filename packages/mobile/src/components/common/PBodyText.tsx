import React, { FC, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Linking,
  Pressable,
  StyleProp,
  TextStyle,
} from 'react-native';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import FastImage from 'react-native-fast-image';

import PLabel from 'mobile/src/components/common/PLabel';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import pStyles from 'mobile/src/theme/pStyles';
import { Body2Bold } from 'mobile/src/theme/fonts';
import { WHITE, WHITE12, PRIMARY, GRAY900 } from 'shared/src/colors';

import { processPost } from 'shared/src/patterns';

interface PBodyTextProps {
  body?: string;
  hideLinkPreview?: boolean;
  collapseLongText?: boolean;
  style?: StyleProp<TextStyle>;
}

const PBodyText: FC<PBodyTextProps> = ({
  body,
  hideLinkPreview = false,
  collapseLongText = false,
  style,
}) => {
  const isLong = (body?.length ?? 0) > 200;
  const [more, setMore] = useState(collapseLongText && isLong);

  const goToUrl = (url: string): void => {
    let link = url;
    if (!url.startsWith('http') || !url.startsWith('https')) {
      link = `https://${url}`;
    }
    Linking.openURL(link);
  };

  const goToProfile = (userId: string): void => {
    NavigationService.navigate('UserDetails', {
      screen: 'UserProfile',
      params: {
        userId,
      },
    });
  };

  const search = (text: string): void => {
    NavigationService.navigate('Search', {
      searchString: text,
    });
  };

  if (!body) {
    return null;
  }

  return (
    <LinkPreview
      containerStyle={styles.previewContainer}
      renderLinkPreview={({ previewData }) => (
        <>
          <Text
            numberOfLines={more ? 3 : undefined}
            style={[styles.body, style]}
            selectable={true}>
            {processPost(body).map((split, index) => {
              if (split.startsWith('$') || split.startsWith('#')) {
                return (
                  <Text
                    key={`${split}-${index}`}
                    style={styles.tagLink}
                    onPress={() => search(split)}>
                    {split}
                  </Text>
                );
              } else if (split.startsWith('@') && split.includes('|')) {
                const [name, id] = split.substring(1).split('|');
                return (
                  <Text
                    key={id}
                    style={styles.tagLink}
                    onPress={() => goToProfile(id)}>
                    @{name}
                  </Text>
                );
              } else if (split.startsWith('%%')) {
                return (
                  <Text
                    key={`${split}-${index}`}
                    style={styles.tagLink}
                    onPress={() => goToUrl(split.substring(2).trim())}>
                    {split.substring(2)}
                  </Text>
                );
              } else {
                return (
                  <React.Fragment key={`${split}-${index}`}>
                    {split}
                  </React.Fragment>
                );
              }
            })}
          </Text>
          {collapseLongText && isLong ? (
            <Pressable
              onPress={() => setMore(!more)}
              style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}>
              <Text style={styles.more}>read {more ? 'more...' : 'less'}</Text>
            </Pressable>
          ) : null}
          {!hideLinkPreview &&
            (previewData?.title || previewData?.description) && (
              <View style={styles.metaDataContainer}>
                <FastImage
                  source={{ uri: previewData?.image?.url }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <PLabel
                  label={previewData?.title || ''}
                  textStyle={styles.title}
                />
                <PLabel
                  label={previewData?.description || ''}
                  textStyle={styles.description}
                  numberOfLines={2}
                />
              </View>
            )}
        </>
      )}
      textContainerStyle={styles.previewTextContainer}
      text={body}
    />
  );
};

export default PBodyText;

const styles = StyleSheet.create({
  previewContainer: {
    overflow: 'hidden',
  },
  previewTextContainer: {
    marginHorizontal: 5,
    marginTop: 0,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    overflow: 'hidden',
  },
  metaDataContainer: {
    flexDirection: 'column',
    borderColor: WHITE12,
    borderRadius: 8,
    backgroundColor: GRAY900,
    marginBottom: 16,
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
  body: {
    lineHeight: 20,
    color: WHITE,
  },
  tagLink: {
    color: PRIMARY,
  },
  more: {
    color: PRIMARY,
    marginTop: -8,
    marginBottom: 8,
  },
});
