import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Text,
} from 'react-native';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import FastImage from 'react-native-fast-image';
import dayjs from 'dayjs';
import {
  ThumbsUp,
  ChatCenteredText,
  Share as ShareIcon,
  DotsThreeVertical,
} from 'phosphor-react-native';

import PLabel from '../common/PLabel';
import IconButton from '../common/IconButton';
import UserInfo from '../common/UserInfo';
import Tag from '../common/Tag';
import Media from '../common/Media';
import * as NavigationService from '../../services/navigation/NavigationService';
import { showMessage } from '../../services/utils';
import { Body1, Body2Bold, Body3 } from '../../theme/fonts';
import pStyles from '../../theme/pStyles';
import {
  PRIMARYSTATE,
  WHITE,
  WHITE12,
  WHITE60,
  BGDARK,
  PRIMARY,
  GRAY900,
} from 'shared/src/colors';

import { Post } from 'shared/graphql/query/post/usePosts';
import { PostCategories } from 'backend/graphql/enumerations.graphql';

import { useLikePost } from 'shared/graphql/mutation/posts';
import { useCreatePost } from 'shared/graphql/mutation/posts';
import { useAccount } from 'shared/graphql/query/account/useAccount';
import { processPost } from 'shared/src/patterns';

export interface PostItemProps {
  post: Post;
  onPressMenu?: () => void;
  onPressLikes?: () => void;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  onPressMenu,
  onPressLikes,
}) => {
  const { user, company, body, media } = post;
  const [liked, setLiked] = useState(false);
  const [likePost] = useLikePost();
  const [createPost] = useCreatePost();
  const { data: { account } = {} } = useAccount({ fetchPolicy: 'cache-only' });

  useEffect(() => {
    account && setLiked(post.likeIds?.includes(account._id) ?? false);
  }, [post, account]);

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

  const goToDetails = () => {
    NavigationService.navigate('PostDetails', {
      screen: 'PostDetail',
      params: {
        postId: post._id,
      },
    });
  };

  const goToProfile = (userId?: string) => {
    if (userId) {
      NavigationService.navigate('UserDetails', {
        screen: 'UserProfile',
        params: {
          userId,
        },
      });
    } else if (user) {
      NavigationService.navigate('UserDetails', {
        screen: 'UserProfile',
        params: {
          userId: user._id,
        },
      });
    } else if (company) {
      NavigationService.navigate('CompanyDetails', {
        screen: 'CompanyProfile',
        params: {
          companyId: company._id,
        },
      });
    }
  };

  const onShare = async () => {
    try {
      const postData = {
        body: 'Share post',
        likePost: post._id,
        categories: post.categories,
        media: post.media,
        mentionIds: post.mentionIds,
        audience: post.audience,
      };
      // TODO: Share Post

      await createPost({
        variables: {
          post: postData,
        },
      });
      showMessage('success', 'You shared post succesfully');
    } catch (err) {
      console.log(err);
      showMessage('error', (err as Error).message);
    }
  };

  const search = (text: string) => {
    NavigationService.navigate('Search', {
      searchString: text,
    });
  };

  return (
    <Pressable onPress={goToDetails}>
      <View style={styles.container}>
        <View style={[styles.headerWrapper, styles.contentPadding]}>
          <Pressable
            onPress={() => goToProfile()}
            style={({ pressed }) => (pressed ? pStyles.pressedStyle : {})}>
            <UserInfo
              user={user || company}
              avatarSize={56}
              auxInfo={dayjs(post.createdAt).format('MMM D')}
              audienceInfo={post.audience}
            />
          </Pressable>
          <TouchableOpacity
            style={styles.menuContainer}
            onPress={() => onPressMenu?.()}>
            <DotsThreeVertical size={24} color={WHITE60} weight="bold" />
          </TouchableOpacity>
        </View>
        <View style={styles.contentPadding}>
          {body ? (
            <LinkPreview
              containerStyle={styles.previewContainer}
              renderLinkPreview={({ previewData }) => (
                <>
                  <Text style={styles.body} selectable={true}>
                    {processPost(body).map((split, index) => {
                      if (split.startsWith('$') || split.startsWith('#')) {
                        return (
                          <Text
                            key={split}
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
                            {name}
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
                  {previewData?.link && (
                    <PLabel label={previewData.link} textStyle={styles.link} />
                  )}
                  {!media && (previewData?.title || previewData?.description) && (
                    <View style={styles.metaDataContainer}>
                      {media ? (
                        <></>
                      ) : (
                        <FastImage
                          source={{ uri: previewData?.image?.url }}
                          style={styles.previewImage}
                        />
                      )}
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
          ) : null}
          {media ? <Media media={media} /> : null}
        </View>
        <View style={[styles.postInfo, styles.contentPadding]}>
          <View style={styles.tagWrapper}>
            {post.categories.map((item) => (
              <Tag
                label={PostCategories[item]}
                viewStyle={styles.tagStyle}
                key={item}
              />
            ))}
          </View>
          <View style={styles.otherInfo}>
            {post.likeIds && post.likeIds.length > 0 && (
              <Pressable
                onPress={onPressLikes}
                style={({ pressed }) => (pressed ? pStyles.pressedStyle : {})}>
                <PLabel
                  label={`${post.likeIds.length} ${
                    post.likeIds.length === 1 ? 'Like' : 'Likes'
                  }`}
                  textStyle={styles.smallLabel}
                />
              </Pressable>
            )}
            {post.commentIds && post.commentIds.length > 0 && (
              <PLabel
                label={`${post.commentIds.length} ${
                  post.commentIds.length === 1 ? 'Comment' : 'Comments'
                }`}
                textStyle={styles.smallLabel}
              />
            )}
            {post.shareIds && post.shareIds.length > 0 && (
              <PLabel
                label={`${post.shareIds.length} ${
                  post.shareIds.length === 1 ? 'Share' : 'Shares'
                }`}
                textStyle={styles.smallLabel}
              />
            )}
          </View>
        </View>
        <View style={[styles.bottomWrapper, styles.contentPadding]}>
          <IconButton
            icon={
              <ThumbsUp
                weight={liked ? 'fill' : 'light'}
                color={liked ? PRIMARYSTATE : WHITE60}
                size={20}
              />
            }
            label="Like"
            onPress={() => toggleLike()}
          />
          <IconButton
            icon={<ChatCenteredText color={WHITE60} size={20} />}
            label="Comment"
            onPress={goToDetails}
          />
          <IconButton
            icon={<ShareIcon color={WHITE60} size={20} />}
            label="Share"
            onPress={onShare}
          />
        </View>
        <View style={styles.divider} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuContainer: {
    marginTop: 16,
  },
  contentPadding: {
    paddingHorizontal: 16,
  },
  userInfo: {
    marginLeft: 8,
  },
  previewContainer: {
    backgroundColor: BGDARK,
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
  nameLabel: {
    ...Body1,
  },
  smallLabel: {
    ...Body3,
    color: WHITE60,
    marginLeft: 4,
  },
  metaDataContainer: {
    flexDirection: 'column',
    borderColor: WHITE12,
    borderRadius: 8,
    backgroundColor: GRAY900,
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
  body: {
    lineHeight: 20,
    color: WHITE,
  },
  tagLink: {
    color: PRIMARY,
  },
  link: {
    color: PRIMARY,
    marginTop: 24,
  },
  postInfo: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tagWrapper: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  tagStyle: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: WHITE12,
  },
  otherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  divider: {
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
    marginTop: 24,
  },
  bottomWrapper: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PostItem;
