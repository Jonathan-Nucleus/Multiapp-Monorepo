import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import UserSvg from 'shared/assets/images/user.svg';
import GlobalSvg from 'shared/assets/images/global.svg';
import Avatar from 'mobile/src/components/common/Avatar';
import Tag from 'mobile/src/components/common/Tag';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PreviewLink from 'mobile/src/components/common/PreviewLink';
import { showMessage } from 'mobile/src/services/ToastService';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE, PRIMARY } from 'shared/src/colors';

import PostSelection from './PostSelection';
import PostHeader from './PostHeader';
import { PostMedia } from 'mobile/src/components/common/Media';
import { AUDIENCE_OPTIONS } from './index';

import { useAccountContext } from 'shared/context/Account';
import { useCreatePost, PostCategories } from 'shared/graphql/mutation/posts';
import { useEditPost } from 'shared/graphql/mutation/posts/useEditPost';
import {
  useLinkPreview,
  LinkPreview,
} from 'shared/graphql/query/post/useLinkPreview';
import { processPost } from 'shared/src/patterns';

import { ReviewPostScreen } from 'mobile/src/navigations/PostDetailsStack';

const ReviewPost: ReviewPostScreen = ({ route, navigation }) => {
  const { ...postData } = route.params;
  const {
    userId,
    audience,
    categories,
    body,
    mentionIds,
    media,
    localMediaPath,
  } = postData;

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
        variables: {
          body,
        },
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
        ? {
            url: media.url,
            aspectRatio: media.aspectRatio,
          }
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
        isSubmitted.current = true;
        navigation.pop(2);
        // it should go to different stack
        navigation.navigate('Main');
      } else {
        showMessage('Error', 'Uh oh! We encountered a problem.');
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
      <PAppContainer modal>
        <View style={styles.usersPart}>
          <Avatar user={account} size={32} />
          <PostSelection icon={<UserSvg />} label={postAsLabel} />
          <PostSelection icon={<GlobalSvg />} label={selectedAudienceLabel} />
        </View>
        <Text style={styles.body} selectable={true}>
          {body
            ? processPost(body).map((split, index) => {
                if (split.startsWith('$') || split.startsWith('#')) {
                  return (
                    <Text key={`${split}-${index}`} style={styles.tagLink}>
                      {split}
                    </Text>
                  );
                } else if (split.startsWith('@') && split.includes('|')) {
                  const [name, id] = split.substring(1).split('|');
                  return (
                    <Text key={id} style={styles.tagLink}>
                      @{name}
                    </Text>
                  );
                } else if (split.startsWith('%%')) {
                  return (
                    <Text key={`${split}-${index}`} style={styles.tagLink}>
                      {split.substring(2)}
                    </Text>
                  );
                } else {
                  return (
                    <React.Fragment key={`${split}-${index}`}>
                      {split}
                    </React.Fragment>
                  );
                }
              })
            : null}
        </Text>
        {media ? (
          <View style={[styles.postImage, { aspectRatio: media.aspectRatio }]}>
            <PostMedia
              userId={account._id}
              media={
                localMediaPath
                  ? {
                      url: localMediaPath,
                      aspectRatio: media.aspectRatio,
                    }
                  : media
              }
              style={styles.preview}
              resizeMode="contain"
            />
          </View>
        ) : null}
        {!localMediaPath && !route.params?.media?.url && previewData && (
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
  usersPart: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  postImage: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    marginVertical: 16,
    lineHeight: 20,
    color: WHITE,
  },
  tagLink: {
    color: PRIMARY,
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
  preview: {
    marginVertical: 0,
  },
});
