import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import dayjs from 'dayjs';

import PLabel from '../common/PLabel';
import IconButton from '../common/IconButton';
import UserInfo from '../common/UserInfo';
import Tag from '../common/Tag';
import { BGDARK, GRAY10, WHITE60 } from 'shared/src/colors';
import { Body1, Body3 } from '../../theme/fonts';
import { PostDataType } from '../../graphql/post';

import ThumbsUpSvg from 'shared/assets/images/thumbsUp.svg';
import ChatSvg from 'shared/assets/images/chat.svg';
import ShareSvg from 'shared/assets/images/share.svg';
import Avatar from '../../assets/avatar.png';

import { FetchPostsData } from 'mobile/src/hooks/queries';
import { PostCategories } from 'backend/graphql/enumerations.graphql';
import { useLikePost } from '../../graphql/mutation/posts';
import { useAccount } from '../../graphql/query/account';

import { AVATAR_URL, POST_URL } from 'react-native-dotenv';

type Post = Exclude<FetchPostsData['posts'], undefined>[number];
interface FeedItemProps {
  post: Post;
}

const PostItem: React.FC<FeedItemProps> = ({ post }) => {
  const { user } = post;
  const [liked, setLiked] = useState(false);
  const [likePost] = useLikePost();
  const { data } = useAccount();
  const account = data?.account;

  useEffect(() => {
    setLiked(post.likeIds?.includes(account?._id));
  }, [account, post]);

  const toggleLike = async (): Promise<void> => {
    const toggled = !liked;
    try {
      const { data: postData } = await likePost({
        variables: { like: toggled, postId: post._id },
      });

      postData && postData.likePost
        ? setLiked(toggled)
        : console.log('Error liking post');
    } catch (err) {
      console.log('Error liking post', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <UserInfo
          avatar={{ uri: `${AVATAR_URL}/${user.avatar}` }}
          name={`${user.firstName} ${user.lastName}`}
          role={user.position}
          company={user.company?.name}
          avatarSize={56}
          auxInfo={dayjs(post.createdAt).format('MMM D')}
          isPro
        />
      </View>
      <PLabel label={post.body} textStyle={styles.body} />
      <FastImage
        style={styles.postImage}
        source={{ uri: `${POST_URL}/${post.mediaUrl}` }}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.postInfo}>
        <View style={styles.tagWrapper}>
          {post.categories.map((item: string, index: number) => (
            <Tag
              label={PostCategories[item]}
              viewStyle={styles.tagStyle}
              key={index}
            />
          ))}
        </View>
        <View style={styles.otherInfo}>
          {post.likeIds && post.likeIds.length > 0 && (
            <PLabel
              label={`${post.likeIds.length} Likes`}
              textStyle={styles.smallLabel}
            />
          )}
          {post.commentIds && post.commentIds.length > 0 && (
            <PLabel
              label={`${post.commentIds.length} Comments`}
              textStyle={styles.smallLabel}
            />
          )}
          {post.shareIds && post.shareIds.length > 0 && (
            <PLabel
              label={`${post.shareIds.length} Comments`}
              textStyle={styles.smallLabel}
            />
          )}
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.bottomWrapper}>
        <IconButton
          icon={<ThumbsUpSvg />}
          label="Like"
          onPress={() => toggleLike()}
        />
        <IconButton icon={<ChatSvg />} label="Comment" />
        <IconButton icon={<ShareSvg />} label="Share" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 14,
    flexDirection: 'column',
    marginVertical: 8,
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
  body: {
    lineHeight: 20,
  },
  postInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagWrapper: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  tagStyle: {
    marginRight: 8,
    marginBottom: 8,
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

export default PostItem;
