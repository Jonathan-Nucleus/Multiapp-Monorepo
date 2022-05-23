import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import dayjs from 'dayjs';
import { DotsThreeVertical } from 'phosphor-react-native';

import UserInfo from 'mobile/src/components/common/UserInfo';
import Media from 'mobile/src/components/common/Media';
import PBodyText from 'mobile/src/components/common/PBodyText';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE60 } from 'shared/src/colors';

import UserPostActionModal from './UserPostActionModal';
import OwnPostActionModal from './OwnPostActionModal';
import SharePostItem from '../../SharePostItem';

import { Post } from 'shared/graphql/query/post/usePosts';

import { useAccount } from 'shared/graphql/query/account/useAccount';

export interface PostContentProps {
  post: Post;
  hideMenu?: boolean;
}

const PostContent: React.FC<PostContentProps> = ({
  post,
  hideMenu = false,
}) => {
  const { user, company, body, media } = post;

  const { data: { account } = {} } = useAccount({ fetchPolicy: 'cache-only' });
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [kebobMenuVisible, setKebobMenuVisible] = useState(false);
  const [kebobIsClosing, setKebobIsClosing] = useState(false);

  const isMyPost =
    user?._id === account?._id || account?.companyIds?.includes(post.userId);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  });

  const closeKebobMenu = (): void => {
    setKebobIsClosing(true);
    setKebobMenuVisible(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => setKebobIsClosing(false), 500);
  };

  const goToProfile = (): void => {
    if (user) {
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
        <PBodyText
          body={body}
          hideLinkPreview={!!media}
          collapseLongText={true}
        />
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
  sharedPostContainer: {
    marginTop: 16,
  },
});
