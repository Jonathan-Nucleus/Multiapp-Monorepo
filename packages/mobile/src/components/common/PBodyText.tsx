import React, { FC, useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Linking,
  StyleProp,
  TextStyle,
  TextLayoutEventData,
} from 'react-native';

import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import { WHITE, PRIMARY } from 'shared/src/colors';

import { processPost, TAG_PATTERN } from 'shared/src/patterns';
import PText from './PText';

interface PBodyTextProps {
  body?: string;
  hideLinkPreview?: boolean;
  collapseLongText?: boolean;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
}

const PBodyText: FC<PBodyTextProps> = ({
  body,
  collapseLongText = false,
  numberOfLines = 2,
  style,
}) => {
  // Remove last line break from body;
  const initialBody = body?.replace(/\n$/, '') ?? '';
  const [showMore, setShowMore] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

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

  const onHiddenTextLayout = useCallback(
    (e: { nativeEvent: TextLayoutEventData }) => {
      if (!collapseLongText || numberOfLines <= 0) {
        return;
      }

      const { lines: txtLines = [] } = e.nativeEvent as TextLayoutEventData;
      const _showMore = txtLines.length > numberOfLines;
      setShowMore(_showMore);
    },
    [collapseLongText, numberOfLines],
  );

  const handleMoreText = (): void => {
    setCollapsed(!collapsed);
  };

  const readMoreText =
    collapseLongText && collapsed ? 'Read more...' : 'Read less';

  const renderText = useMemo(() => {
    return processPost(initialBody).map((split, index) => {
      if (
        (split.startsWith('$') || split.startsWith('#')) &&
        split.match(TAG_PATTERN)
      ) {
        return (
          <PText
            key={`${split}-${index}`}
            style={styles.tagLink}
            onPress={() => search(split)}>
            {split}
          </PText>
        );
      } else if (split.startsWith('@') && split.includes('|')) {
        const [name, id] = split.substring(1).split('|');
        const text = `@${name}`;

        return (
          <PText
            key={id}
            style={styles.tagLink}
            onPress={() => goToProfile(id)}>
            {text}
          </PText>
        );
      } else if (split.startsWith('%%')) {
        const text = split.substring(2);

        return (
          <PText
            key={`${split}-${index}`}
            style={styles.tagLink}
            onPress={() => goToUrl(split.substring(2).trim())}>
            {text}
          </PText>
        );
      } else {
        return (
          <React.Fragment key={`${split}-${index}`}>{split}</React.Fragment>
        );
      }
    });
  }, [initialBody]);

  if (!initialBody) {
    return null;
  }

  return (
    <View style={styles.previewContainer}>
      {collapseLongText && (
        <PText
          style={[styles.body, styles.hidden, style]}
          onTextLayout={onHiddenTextLayout}>
          {renderText}
        </PText>
      )}
      <View
        style={[
          styles.collapseWrapper,
          {
            ...(showMore && collapsed
              ? {
                  height: styles.body.lineHeight * Math.max(1, numberOfLines),
                }
              : {}),
          },
        ]}>
        <PText
          style={[
            styles.body,
            style,
            { ...(showMore && collapsed ? { position: 'absolute' } : {}) },
          ]}
          selectable={true}>
          {renderText}
          {collapseLongText && showMore && !collapsed ? (
            <PText style={styles.more} onPress={handleMoreText}>
              {readMoreText}
            </PText>
          ) : null}
        </PText>
      </View>
      {collapseLongText && showMore && collapsed ? (
        <PText style={styles.more} onPress={handleMoreText}>
          {readMoreText}
        </PText>
      ) : null}
    </View>
  );
};

export default PBodyText;

const styles = StyleSheet.create({
  previewContainer: {
    paddingBottom: 16,
  },
  collapseWrapper: {
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
    lineHeight: 20,
    flexWrap: 'nowrap',
  },
  hidden: {
    position: 'absolute',
    opacity: 0,
  },
});
