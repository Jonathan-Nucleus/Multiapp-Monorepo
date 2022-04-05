import React from 'react';
import { View, StyleSheet } from 'react-native';

import PLabel from '../../components/common/PLabel';
import IconButton from '../../components/common/IconButton';
import RoundImageView from '../../components/common/RoundImageView';
import Tag from '../../components/common/Tag';
import { BGDARK, GRAY10 } from 'shared/src/colors';
import { Body1, Body3 } from '../../theme/fonts';

import ThumbsUpSvg from 'shared/assets/images/thumbsUp.svg';
import ThumbsUp2Svg from 'shared/assets/images/thumbsUp2.svg';
import ChatSvg from 'shared/assets/images/chat.svg';
import ShareSvg from 'shared/assets/images/share.svg';
import Avatar from '../../assets/avatar.png';

export interface FeedItemProps {
  name: string;
  description: string;
  tags: string[];
  commentCounts: number;
  shareCounts: number;
  containerStyle?: object;
}

const FeedItem: React.FC<FeedItemProps> = (props) => {
  const {
    name,
    description,
    tags,
    commentCounts,
    shareCounts,
    containerStyle,
  } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.headerWrapper}>
        <RoundImageView image={Avatar} />
        <View style={styles.userInfo}>
          <PLabel label={name} textStyle={styles.nameLabel} />
        </View>
      </View>
      <PLabel label={description} />
      <View style={styles.tagWrapper}>
        {tags.map((item: string) => (
          <Tag label={item} viewStyle={styles.tagStyle} />
        ))}
      </View>
      <View style={styles.otherInfo}>
        <IconButton
          icon={<ThumbsUp2Svg />}
          label="Steve Jobs and 3 others"
          textStyle={styles.smallLabel}
        />
        <PLabel
          label={`${commentCounts} Comments`}
          textStyle={styles.smallLabel}
        />
        <PLabel label={`${shareCounts} Shares`} textStyle={styles.smallLabel} />
      </View>
      <View style={styles.divider} />
      <View style={styles.bottomWrapper}>
        <IconButton icon={<ThumbsUpSvg />} label="Like" />
        <IconButton icon={<ChatSvg />} label="Comment" />
        <IconButton icon={<ShareSvg />} label="Share" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'column',
    backgroundColor: BGDARK,
  },
  headerWrapper: {
    flexDirection: 'row',
    marginVertical: 16,
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 8,
  },
  nameLabel: {
    ...Body1,
  },
  smallLabel: {
    ...Body3,
  },
  tagWrapper: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  tagStyle: {
    marginRight: 8,
  },
  otherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  divider: {
    borderBottomColor: GRAY10,
    borderBottomWidth: 1,
    marginVertical: 16,
  },
  bottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default FeedItem;
