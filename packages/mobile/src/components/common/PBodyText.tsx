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

import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE, PRIMARY } from 'shared/src/colors';

import { processPost } from 'shared/src/patterns';

interface PBodyTextProps {
  body?: string;
  hideLinkPreview?: boolean;
  collapseLongText?: boolean;
  style?: StyleProp<TextStyle>;
}

const PBodyText: FC<PBodyTextProps> = ({
  body,
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
    <View style={styles.previewContainer}>
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
              <React.Fragment key={`${split}-${index}`}>{split}</React.Fragment>
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
    </View>
  );
};

export default PBodyText;

const styles = StyleSheet.create({
  previewContainer: {
    overflow: 'hidden',
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
