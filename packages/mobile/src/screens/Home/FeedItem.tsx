import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import FastImage from 'react-native-fast-image';

import PLabel from '../../components/common/PLabel';
import IconButton from '../../components/common/IconButton';
import UserInfo from '../../components/common/UserInfo';
import Tag from '../../components/common/Tag';
import { BGDARK, GRAY10, WHITE60 } from 'shared/src/colors';
import { Body1, Body3 } from '../../theme/fonts';
import { PostDataType } from '../../graphql/post';

import ThumbsUpSvg from 'shared/assets/images/thumbsUp.svg';
import ThumbsUp2Svg from 'shared/assets/images/thumbsUp2.svg';
import ChatSvg from 'shared/assets/images/chat.svg';
import ShareSvg from 'shared/assets/images/share.svg';
import Avatar from '../../assets/avatar.png';

export interface FeedItemProps extends PostDataType {
  name: string;
  company: string;
  date: string;
  commentCounts: number;
  shareCounts: number;
  containerStyle?: object;
}

const FeedItem: React.FC<FeedItemProps> = (props) => {
  const {
    name,
    company,
    body,
    categories,
    mediaUrl,
    commentCounts,
    shareCounts,
    containerStyle,
  } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.headerWrapper}>
        <UserInfo
          avatar={Avatar}
          name={name}
          role="CEO"
          company={company}
          isPro
        />
      </View>
      <PLabel label={body} />
      <Image
        style={styles.postImage}
        source={{
          uri: mediaUrl,
          // priority: FastImage.priority.normal,
        }}
        // resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.tagWrapper}>
        {categories.map((item: string, index: number) => (
          <Tag label={item} viewStyle={styles.tagStyle} key={index} />
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
    color: WHITE60,
  },
  postImage: {
    width: '100%',
    height: 224,
    marginVertical: 20,
    borderRadius: 16,
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
