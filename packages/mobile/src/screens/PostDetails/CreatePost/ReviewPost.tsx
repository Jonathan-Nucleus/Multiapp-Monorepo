import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { MentionInput } from 'react-native-controlled-mentions';
import _ from 'lodash';
const Buffer = global.Buffer || require('buffer').Buffer;

import { POST_URL } from 'react-native-dotenv';

import UserSvg from 'shared/assets/images/user.svg';
import GlobalSvg from 'shared/assets/images/global.svg';
import Avatar from 'mobile/src/components/common/Avatar';
import Tag from 'mobile/src/components/common/Tag';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import { showMessage } from 'mobile/src/services/utils';
import pStyles from 'mobile/src/theme/pStyles';
import { SECONDARY, BGDARK } from 'shared/src/colors';

import PreviewLink from './PreviewLink';
import PostSelection from './PostSelection';
import PostHeader from './PostHeader';
import { AUDIENCE_OPTIONS } from './index';

import { useAccount } from 'shared/graphql/query/account/useAccount';
import {
  useCreatePost,
  PostCategories,
  useEditPost,
} from 'shared/graphql/mutation/posts';

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

  const handleSubmit = async () => {
    let success = false;
    let finalPostData = {
      body,
      audience,
      categories,
      media,
      mentionIds,
    };

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
  };

  const postAsLabel =
    account?._id === userId
      ? `${account?.firstName} ${account?.lastName}`
      : account?.companies.find((company) => company._id === userId)?.name ??
        '';
  const selectedAudienceLabel =
    AUDIENCE_OPTIONS.find((option) => option.id === audience)?.value ?? '';

  return (
    <View style={pStyles.globalContainer}>
      <PostHeader
        centerLabel="Preview Post"
        rightLabel="POST"
        rightValidation={true}
        handleNext={handleSubmit}
        handleBack={() => navigation.navigate('Main')}
      />
      <PAppContainer style={styles.bgDark}>
        <View style={styles.usersPart}>
          <Avatar user={account} size={32} />
          <PostSelection
            icon={<UserSvg />}
            label={postAsLabel}
            viewStyle={{ marginHorizontal: 8 }}
          />
          <PostSelection icon={<GlobalSvg />} label={selectedAudienceLabel} />
        </View>
        <MentionInput
          value={body ?? ''}
          onChange={() => {}}
          editable={false}
          style={styles.mentionInput}
          partTypes={[
            {
              trigger: '@',
              textStyle: {
                color: SECONDARY,
              },
            },
          ]}
        />
        {localMediaPath ? (
          <Image source={{ uri: localMediaPath }} style={styles.postImage} />
        ) : (
          route.params?.media && (
            <Image
              source={{ uri: `${POST_URL}/${route.params?.media.url}` }}
              style={styles.postImage}
            />
          )
        )}
        {!localMediaPath && !route.params?.mediaUrl && (
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
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagStyle: {
    paddingHorizontal: 15,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
  },
});
