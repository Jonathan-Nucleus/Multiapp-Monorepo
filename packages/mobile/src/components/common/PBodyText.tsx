import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Linking,
  StyleProp,
  TextStyle,
  TextLayoutEventData,
  Dimensions,
} from 'react-native';

import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import { WHITE, PRIMARY } from 'shared/src/colors';

import { processPost, TAG_PATTERN } from 'shared/src/patterns';
import PText from './PText';

const INITIAL_READ_MORE_WIDTH = 86;
const INITIAL_CONTAINER_WIDTH = Dimensions.get('window').width - 32;

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
  const [showingBody, setShowingBody] = useState(initialBody);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [collapsedText, setCollapsedText] = useState(initialBody);
  const [more, setMore] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(INITIAL_CONTAINER_WIDTH);
  const [btnTextWidth, setBtnTextWidth] = useState(INITIAL_READ_MORE_WIDTH);
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
              let ret = '';
              if (index < numberOfLines - 1) {
                ret = text;
              } else {
                // Remove enter key of last line
                ret = text.replace(/(\r\n|\n|\r)/gm, '');
              }

              return ret;
            });

          setShowingBody(showingLines.join('') ?? '');
          setCollapsedText(showingLines.join('') ?? '');
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

  const onHiddenButtonTextLayout = useCallback(
    (e: { nativeEvent: TextLayoutEventData }) => {
      const { lines: txtLines = [] } = e.nativeEvent as TextLayoutEventData;
      const length = txtLines.length;

      if (length > 0) {
        setBtnTextWidth(txtLines[length - 1].width);
      }
    },
    [],
  );

  const onContainerLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number } } }) => {
      const { width } = e.nativeEvent.layout;
      setContainerWidth(width);
    },
    [],
  );

  const handleMoreText = useCallback(() => {
    if (initialBody) {
      if (isCollapsed === true) {
        setShowingBody(initialBody);
      } else {
        setShowingBody(collapsedText);
      }
      setIsCollapsed(!isCollapsed);
    }
  }, [collapsedText, initialBody, isCollapsed]);

  const readMoreText = useMemo(() => {
    const determinedLine =
      (isCollapsed ? limitLine.current : lastLine.current) + btnTextWidth >=
      containerWidth;
    return `${determinedLine ? '\n' : ' '}Read ${
      isCollapsed ? 'more...' : 'less'
    }`;
  }, [btnTextWidth, containerWidth, isCollapsed]);

  const renderText = useMemo(() => {
    const val = !collapseLongText ? initialBody : showingBody;
    return processPost(val).map((split, index) => {
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
  }, [initialBody, collapseLongText, showingBody]);

  if (!initialBody) {
    return null;
  }

  return (
    <View style={styles.previewContainer} onLayout={onContainerLayout}>
      {collapseLongText && (
        <PText
          style={[styles.body, styles.hidden, style]}
          onTextLayout={onHiddenTextLayout}>
          {initialBody}
        </PText>
      )}
      {collapseLongText && (
        <PText
          style={[styles.body, styles.hidden, style]}
          onTextLayout={onHiddenButtonTextLayout}>
          {readMoreText + ' '}
        </PText>
      )}
      <PText style={[styles.body, style]} selectable={true}>
        {renderText}
        {collapseLongText && more === true ? (
          <PText style={styles.more} onPress={handleMoreText}>
            {readMoreText}
          </PText>
        ) : null}
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
  hidden: {
    position: 'absolute',
    opacity: 0,
  },
});
