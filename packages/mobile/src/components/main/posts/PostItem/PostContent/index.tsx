import React, { useRef, useEffect, useState, ReactElement } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import { DotsThreeVertical } from 'phosphor-react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import UserInfo from 'mobile/src/components/common/UserInfo';
import { PostMedia } from 'mobile/src/components/common/Media';
import PBodyText from 'mobile/src/components/common/PBodyText';
import PreviewLink from 'mobile/src/components/common/PreviewLink';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import pStyles from 'mobile/src/theme/pStyles';
import { BLACK, PRIMARYSOLID, WHITE60 } from 'shared/src/colors';

import UserPostActionModal from './UserPostActionModal';
import OwnPostActionModal from './OwnPostActionModal';
import SharePostItem from 'mobile/src/components/main/posts/SharePostItem';
import { Media as MediaType } from 'shared/graphql/fragments/post';

import { Post } from 'shared/graphql/query/post/usePosts';

import { useAccountContext } from 'shared/context/Account';
import { getPostTime } from '../../../../../utils/dateTimeUtil';
const DEVICE_WIDTH = Dimensions.get('window').width;

export interface PostContentProps {
  post: Post;
  hideMenu?: boolean;
  itemWidth?: number;
  onPress?: () => void;
}

const PostContent: React.FC<PostContentProps> = ({
  post,
  hideMenu = false,
  itemWidth = DEVICE_WIDTH - 32,
  onPress,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const { user, company, body, media, preview } = post;

  const account = useAccountContext();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [kebobMenuVisible, setKebobMenuVisible] = useState(false);
  const [kebobIsClosing, setKebobIsClosing] = useState(false);

  const isMyPost =
    post.userId === account._id || account.companyIds?.includes(post.userId);

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

  const goToDetails = (comment?: boolean): void => {
    const currentRoute = NavigationService.currentRoute();
    if (!comment && currentRoute?.name === 'PostDetail') {
      return;
    }

    NavigationService.navigate('PostDetails', {
      screen: 'PostDetail',
      params: {
        postId: post._id,
        focusComment: comment,
      },
    });
  };

  const goToSharedPost = (): void => {
    if (!post.sharedPost) {
      return;
    }

    NavigationService.navigate('PostDetails', {
      screen: 'PostDetail',
      params: {
        postId: post.sharedPost?._id,
      },
    });
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

  const renderPostMedia = ({ item }: { item: MediaType }): ReactElement => (
    <PostMedia
      userId={post.userId}
      mediaId={post._id}
      media={item}
      style={styles.media}
      onPress={onPress || goToDetails}
    />
  );

  return (
    <View style={styles.container}>
      <View style={[styles.headerWrapper, styles.contentPadding]}>
        <Pressable
          onPress={onPress || goToProfile}
          style={({ pressed }) => (pressed ? pStyles.pressedStyle : {})}>
          <UserInfo
            user={user || company}
            avatarSize={56}
            auxInfo={getPostTime(post.createdAt)}
            audienceInfo={post.audience}
            highlighted={post.highlighted}
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
        <Pressable onPress={() => goToDetails()}>
          <PBodyText body={body} collapseLongText={true} style={styles.body} />
        </Pressable>
        {media && media.length > 0 ? (
          <View>
            <Carousel
              data={media}
              scrollEnabled={media.length > 1}
              canCancelContentTouches={true}
              sliderWidth={itemWidth}
              itemWidth={itemWidth}
              renderItem={renderPostMedia}
              keyExtractor={(item) => item.url}
              onSnapToItem={(index) => setSlideIndex(index)}
              contentContainerCustomStyle={styles.carouselItem}
            />
            <Pagination
              containerStyle={styles.paginationContainer}
              activeDotIndex={slideIndex}
              dotsLength={media.length}
              dotStyle={styles.dot}
              inactiveDotScale={1}
              inactiveDotStyle={styles.inactiveDot}
            />
          </View>
        ) : preview ? (
          <PreviewLink previewData={preview} />
        ) : null}
        {post.sharedPost && (
          <View style={styles.sharedPostContainer}>
            <SharePostItem post={post.sharedPost} onPress={goToSharedPost} />
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
  body: {
    marginBottom: 0,
  },
  media: {
    marginTop: 0,
  },
  menuContainer: {
    marginTop: 16,
  },
  contentPadding: {
    paddingHorizontal: 16,
  },
  sharedPostContainer: {
    marginBottom: 16,
  },
  paginationContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARYSOLID,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: PRIMARYSOLID,
    backgroundColor: BLACK,
  },
  carouselItem: {
    alignItems: 'center',
  },
});
