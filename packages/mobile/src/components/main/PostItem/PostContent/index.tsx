import React, { useRef, useEffect, useState } from 'react';
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
import { DotsThreeVertical } from 'phosphor-react-native';

import PLabel from 'mobile/src/components/common/PLabel';
import UserInfo from 'mobile/src/components/common/UserInfo';
import Media from 'mobile/src/components/common/Media';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import { Body1, Body2Bold, Body3 } from 'mobile/src/theme/fonts';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE, WHITE12, WHITE60, PRIMARY, GRAY900 } from 'shared/src/colors';

import UserPostActionModal from './UserPostActionModal';
import OwnPostActionModal from './OwnPostActionModal';
import SharePostItem from '../../SharePostItem';

import { Post } from 'shared/graphql/query/post/usePosts';

import { useAccount } from 'shared/graphql/query/account/useAccount';
import { processPost } from 'shared/src/patterns';

export interface PostContentProps {
  post: Post;
  hideMenu?: boolean;
}

const PostContent: React.FC<PostContentProps> = ({
  post,
  hideMenu = false,
}) => {
  const { user, company, body, media } = post;

  const [more, setMore] = useState(false);
  const { data: { account } = {} } = useAccount({ fetchPolicy: 'cache-only' });

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [kebobMenuVisible, setKebobMenuVisible] = useState(false);
  const [kebobIsClosing, setKebobIsClosing] = useState(false);

  const isMyPost =
    user?._id === account?._id || account?.companyIds?.includes(post.userId);

  useEffect(() => {
    if (body && body.length > 200) {
      return setMore(true);
    }
    setMore(false);
  }, [body]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  });

  const closeKebobMenu = () => {
    setKebobIsClosing(true);
    setKebobMenuVisible(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => setKebobIsClosing(false), 500);
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

  const search = (text: string) => {
    NavigationService.navigate('Search', {
      searchString: text,
    });
  };

  return (
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
        {!hideMenu && (
          <TouchableOpacity
            style={styles.menuContainer}
            onPress={() => setKebobMenuVisible(true)}>
            <DotsThreeVertical size={24} color={WHITE60} weight="bold" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.contentPadding}>
        {body ? (
          <LinkPreview
            containerStyle={styles.previewContainer}
            renderLinkPreview={({ previewData }) => (
              <>
                <Text
                  numberOfLines={more ? 3 : undefined}
                  style={styles.body}
                  selectable={true}>
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
        {more && (
          <Pressable onPress={() => setMore(false)}>
            <Text style={styles.more}>read more...</Text>
          </Pressable>
        )}
        {media ? <Media media={media} /> : null}
        {post.sharedPost && (
          <View style={styles.sharedPostContainer}>
            <SharePostItem post={post.sharedPost} />
          </View>
        )}
      </View>
      {(kebobMenuVisible || kebobIsClosing) &&
        (isMyPost ? (
          <OwnPostActionModal
            post={post}
            visible={kebobMenuVisible && isMyPost}
            onClose={closeKebobMenu}
          />
        ) : (
          <UserPostActionModal
            post={post}
            visible={kebobMenuVisible && !isMyPost}
            onClose={closeKebobMenu}
          />
        ))}
    </View>
  );
};

export default PostContent;

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
    overflow: 'hidden',
    marginBottom: 8,
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
  sharedPostContainer: {
    marginTop: 16,
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
  more: {
    color: PRIMARY,
  },
});
