import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
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
  const [showingBody, setShowingBody] = useState(body ?? '');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [collapsedText, setCollapsedText] = useState(body ?? '');
  const [more, setMore] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const lastLine = useRef<number>(0);
  const limitLine = useRef<number>(0);

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
      if (!initialLoaded && collapseLongText) {
        const { lines: txtLines = [] } = e.nativeEvent as TextLayoutEventData;
        const showMore = txtLines.length > numberOfLines;
        setMore(showMore);
        if (showMore) {
          const showingLines = txtLines
            .slice(0, numberOfLines)
            .map(({ text }, index) => {
              return index < numberOfLines - 1
                ? text
                : text.replace(/(\r\n|\n|\r)/gm, '');
            });
          setShowingBody(showingLines.join(' ') ?? '');
          setCollapsedText(showingLines.join(' ') ?? '');
        }
        setInitialLoaded(true);
        lastLine.current = txtLines[txtLines.length - 1].width;
        limitLine.current =
          txtLines.length > numberOfLines
            ? txtLines[numberOfLines - 1].width
            : lastLine.current;
      }
    },
    [collapseLongText, initialLoaded, numberOfLines],
  );

  const onContainerLayout = useCallback(
    (e: { nativeEvent: { layout: { width: any } } }) => {
      const { width } = e.nativeEvent.layout;
      setContainerWidth(width);
    },
    [],
  );

  const handleMoreText = useCallback(() => {
    if (body) {
      if (isCollapsed) {
        setShowingBody(body);
      } else {
        setShowingBody(collapsedText);
      }
      setIsCollapsed(!isCollapsed);
    }
  }, [body, collapsedText, isCollapsed]);

  const readMoreText = useMemo(() => {
    const determinedLine =
      (isCollapsed ? limitLine.current : lastLine.current) >
      containerWidth - 90;
    return `${determinedLine ? '\n' : ' '}Read ${
      isCollapsed ? 'more...' : 'less'
    }`;
  }, [containerWidth, isCollapsed]);

  const renderText = useMemo(() => {
    return processPost(showingBody).map((split, index) => {
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
        return (
          <PText
            key={id}
            style={styles.tagLink}
            onPress={() => goToProfile(id)}>
            @{name}
          </PText>
        );
      } else if (split.startsWith('%%')) {
        return (
          <PText
            key={`${split}-${index}`}
            style={styles.tagLink}
            onPress={() => goToUrl(split.substring(2).trim())}>
            {split.substring(2)}
          </PText>
        );
      } else {
        return (
          <React.Fragment key={`${split}-${index}`}>{split}</React.Fragment>
        );
      }
    });
  }, [showingBody]);

  if (!body) {
    return null;
  }

  return (
    <View style={styles.previewContainer} onLayout={onContainerLayout}>
      <PText
        onTextLayout={onHiddenTextLayout}
        style={[[styles.body, style, styles.hiddenText]]}>
        {body}
      </PText>
      <PText style={[styles.body, style]} selectable={true}>
        {renderText}
        {more && (
          <PText style={styles.more} onPress={handleMoreText}>
            {readMoreText}
          </PText>
        )}
      </PText>
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
  },
  hiddenText: {
    position: 'absolute',
    opacity: 0,
  },
});
