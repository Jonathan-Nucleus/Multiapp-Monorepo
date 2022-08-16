import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';

import UserSvg from 'shared/assets/images/user.svg';
import GlobalSvg from 'shared/assets/images/global.svg';
import Avatar from 'mobile/src/components/common/Avatar';
import Tag from 'mobile/src/components/common/Tag';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PreviewLink from 'mobile/src/components/common/PreviewLink';
import { showMessage } from 'mobile/src/services/ToastService';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE, BLACK, BGDARK100 } from 'shared/src/colors';

import PostSelection from './PostSelection';
import PostHeader from './PostHeader';
import { isVideo, PostMedia } from 'mobile/src/components/common/Media';
import PBodyText from 'mobile/src/components/common/PBodyText';
import { AUDIENCE_OPTIONS } from './index';

import { useAccountContext } from 'shared/context/Account';
import { useCreatePost, PostCategories } from 'shared/graphql/mutation/posts';
import { useEditPost } from 'shared/graphql/mutation/posts/useEditPost';
import {
  useLinkPreview,
  LinkPreview,
} from 'shared/graphql/query/post/useLinkPreview';
import { Media as SharedPostMedia } from 'shared/graphql/fragments/post';

import { ReviewPostScreen } from 'mobile/src/navigations/PostDetailsStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const VideoPosted = 'VideoPosted';
const DEVICE_WIDTH = Dimensions.get('window').width;
interface EditPostMedia extends SharedPostMedia {
  path?: string;
}

const ReviewPost: ReviewPostScreen = ({ route, navigation }) => {
  const { ...postData } = route.params;
  const { userId, audience, categories, body, mentionIds, media } = postData;

  const account = useAccountContext();
  const [createPost] = useCreatePost();
  const [editPost] = useEditPost();
  const [fetchPreviewData] = useLinkPreview();

  const [previewData, setPreviewData] = useState<LinkPreview>();
  const [isSubmitting, setSubmitting] = useState(false);
  const isSubmitted = useRef(false);

  useEffect(() => {
    const getData = async (): Promise<void> => {
      if (!body) {
        return;
      }

      const { data } = await fetchPreviewData({
        variables: { body },
      });

      setPreviewData(data?.linkPreview ?? undefined);
    };

    getData();
  }, [body, fetchPreviewData]);

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitted.current || isSubmitting) {
      return;
    }

    setSubmitting(true);

    let success = false;
    const finalPostData = {
      body,
      audience,
      categories,
      media: media
        ? media.map((mediaItem) => ({
            url: mediaItem.url,
            aspectRatio: mediaItem.aspectRatio,
            documentLink: mediaItem.documentLink,
          }))
        : undefined,
      mentionIds,
    };

    const preview = previewData as LinkPreview & {
      __typename?: string;
    };

    if (preview) {
      delete preview.__typename;
    }

    try {
      if (postData._id) {
        const result = await editPost({
          variables: {
            post: {
              _id: postData._id.toString(),
              userId,
              preview,
              ...finalPostData,
            },
          },
        });

        if (result && result.data && result.data.editPost) {
          showMessage('success', 'Successfully edited!');
          success = true;
        }
      } else {
        const result = await createPost({
          variables: {
            post: {
              ...finalPostData,
              ...(userId !== account._id ? { companyId: userId } : {}),
              preview,
            },
          },
        });

        if (result && result.data && result.data.createPost) {
          showMessage('success', 'Successfully posted!');
          success = true;
        }
      }

      if (success) {
        if (media && media.some((item) => isVideo(item.url))) {
          await AsyncStorage.setItem(VideoPosted, 'true');
        }
        isSubmitted.current = true;
        navigation.pop(2);
        // it should go to different stack
        navigation.navigate('Main');
      } else {
        showMessage('error', 'Uh oh! We encountered a problem.');
      }
    } catch (err) {
      console.log('Error', err);
      showMessage('error', 'Uh oh! We encountered a problem.');
    }

    setSubmitting(false);
  };

  const postAsLabel =
    account._id === userId
      ? `${account.firstName} ${account.lastName}`
      : account.companies.find((company) => company._id === userId)?.name ?? '';
  const selectedAudienceLabel =
    AUDIENCE_OPTIONS.find((option) => option.id === audience)?.value ?? '';

  return (
    <View style={[pStyles.globalContainer, pStyles.modal]}>
      <PostHeader
        centerLabel="Preview Post"
        rightLabel="POST"
        rightValidation={!isSubmitting}
        handleNext={handleSubmit}
        handleBack={() => navigation.goBack()}
      />
      <PAppContainer modal disableKeyboardScroll>
        <View style={styles.usersPart}>
          <Avatar user={account} size={32} />
          <PostSelection icon={<UserSvg />} label={postAsLabel} />
          <PostSelection icon={<GlobalSvg />} label={selectedAudienceLabel} />
        </View>
        <Text style={styles.body} selectable={true}>
          {body ? <PBodyText body={body} collapseLongText={false} /> : null}
        </Text>
        <View style={styles.flex}>
          {media && media.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={media.length > 1}>
              {media.map((item, index: number) => {
                return (
                  <View
                    key={index}
                    style={[
                      styles.attachment,
                      media.length > 1
                        ? styles.previewContainer
                        : styles.onePreviewContainer,
                    ]}>
                    <PostMedia
                      userId={account._id}
                      mediaId={postData._id}
                      media={{
                        ...item,
                        url: item.path ?? item.url,
                      }}
                      style={[
                        styles.preview,
                        media.length > 1
                          ? styles.multiPreview
                          : styles.onePreview,
                      ]}
                    />
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
        {media && !media[0]?.url && previewData && (
          <PreviewLink previewData={previewData} />
        )}
        {categories && categories.length > 0 && (
          <View style={styles.tagContainer}>
            {categories.map((category) => (
              <Tag
                key={category}
                label={PostCategories[category]}
                viewStyle={styles.tagStyle}
              />
            ))}
          </View>
        )}
      </PAppContainer>
    </View>
  );
};

export default ReviewPost;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  usersPart: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachment: {
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  preview: {
    marginVertical: 0,
    marginTop: 0,
    backgroundColor: BLACK,
    borderRadius: 0,
  },
  onePreview: {
    width: DEVICE_WIDTH - 32,
  },
  multiPreview: {
    width: (276 * DEVICE_WIDTH) / 390,
  },
  previewContainer: {
    marginRight: 20,
    backgroundColor: BGDARK100,
  },
  onePreviewContainer: {
    backgroundColor: BGDARK100,
  },
  body: {
    marginVertical: 16,
    lineHeight: 20,
    color: WHITE,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  tagStyle: {
    paddingHorizontal: 15,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
  },
});
