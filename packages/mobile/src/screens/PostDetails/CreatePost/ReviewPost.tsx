import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { MentionInput } from 'react-native-controlled-mentions';
const Buffer = global.Buffer || require('buffer').Buffer;

import { POST_URL } from 'react-native-dotenv';

import UserSvg from 'shared/assets/images/user.svg';
import GlobalSvg from 'shared/assets/images/global.svg';
import Avatar from 'mobile/src/components/common/Avatar';
import Tag from 'mobile/src/components/common/Tag';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import { showMessage } from 'mobile/src/services/utils';
import pStyles from 'mobile/src/theme/pStyles';
import { BGDARK, WHITE, PRIMARY, BLACK } from 'shared/src/colors';

import PreviewLink from './PreviewLink';
import PostSelection from './PostSelection';
import PostHeader from './PostHeader';
import Media from 'mobile/src/components/common/Media';
import { AUDIENCE_OPTIONS } from './index';

import { useAccount } from 'shared/graphql/query/account/useAccount';
import { useCreatePost, PostCategories } from 'shared/graphql/mutation/posts';
import { useEditPost } from 'shared/graphql/mutation/posts/useEditPost';
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

  const { data: accountData } = useAccount();
  const [createPost] = useCreatePost();
  const [editPost] = useEditPost();

  const account = accountData?.account;

  const handleSubmit = async (): Promise<void> => {
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

    try {
      if (postData._id) {
        const result = await editPost({
          variables: {
            post: {
              _id: postData._id.toString(),
              userId,
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
              ...(userId !== account?._id ? { companyId: userId } : {}),
            },
          },
        });

        if (result && result.data && result.data.createPost) {
          showMessage('success', 'Successfully posted!');
          success = true;
        }
      }

      if (success) {
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
  };

  const postAsLabel =
    account?._id === userId
      ? `${account?.firstName} ${account?.lastName}`
      : account?.companies.find((company) => company._id === userId)?.name ??
        '';
  const selectedAudienceLabel =
    AUDIENCE_OPTIONS.find((option) => option.id === audience)?.value ?? '';

  return (
    <View style={[pStyles.globalContainer, pStyles.modal]}>
      <PostHeader
        centerLabel="Preview Post"
        rightLabel="POST"
        rightValidation={true}
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
        {route.params.media ? (
          <View style={styles.postImage}>
            <Media
              media={route.params.media}
              style={styles.preview}
              resizeMode="contain"
            />
          </View>
        ) : null}
        {!localMediaPath && !route.params?.media?.url && (
          <PreviewLink body={body ?? ''} />
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
  bgDark: {
    backgroundColor: BGDARK,
  },
  usersPart: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mentionInput: {
    color: 'white',
    marginVertical: 16,
    fontSize: 16,
  },
  postImage: {
    width: '100%',
    height: 224,
    marginVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    marginTop: 16,
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
