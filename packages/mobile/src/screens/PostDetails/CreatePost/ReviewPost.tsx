import React, { useEffect, useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MentionInput,
  replaceMentionValues,
} from 'react-native-controlled-mentions';
import _ from 'lodash';
const Buffer = global.Buffer || require('buffer').Buffer;

import UserSvg from 'shared/assets/images/user.svg';
import GlobalSvg from 'shared/assets/images/global.svg';
import Avatar from 'mobile/src/components/common/Avatar';
import Tag from 'mobile/src/components/common/Tag';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import { showMessage } from 'mobile/src/services/utils';
import pStyles from 'mobile/src/theme/pStyles';
import { SECONDARY } from 'shared/src/colors';
import { SOMETHING_WRONG } from 'shared/src/constants';

import PostSelection from './PostSelection';
import PostHeader from './PostHeader';
import { AUDIENCE_OPTIONS } from './index';

import { useAccount } from 'mobile/src/graphql/query/account';
import { Post } from 'mobile/src/graphql/query/post/usePosts';
import {
  useFetchUploadLink,
  useCreatePost,
  PostCategory,
  PostCategories,
} from 'mobile/src/graphql/mutation/posts';

import { ReviewPostScreen } from 'mobile/src/navigations/PostDetailsStack';

const ReviewPost: ReviewPostScreen = ({ route, navigation }) => {
  const { data: accountData } = useAccount();
  const [createPost] = useCreatePost();

  const account = accountData?.account;
  const {
    categories,
    description,
    mentions,
    mediaUrl,
    audience,
    user,
    localMediaPath,
  } = route.params;

  const handleSubmit = async () => {
    const postData = {
      categories,
      audience,
      body: description,
      mediaUrl,
      mentionIds: mentions,
      // TODO: Update endpoint to accept company
    };

    const result = await createPost({
      variables: {
        post: postData,
      },
    });

    if (result && result.data && result.data.createPost) {
      showMessage('success', 'Successfully posted!');
      navigation.pop(3);
    }
  };

  const postAsLabel =
    account?._id === user
      ? `${account?.firstName} ${account?.lastName}`
      : account?.companies.find((company) => company._id === user)?.name ?? '';
  const selectedAudienceLabel =
    AUDIENCE_OPTIONS.find((option) => option.id === audience)?.value ?? '';

  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PostHeader
        centerLabel="Preview Post"
        rightLabel="POST"
        rightValidation={true}
        handleNext={handleSubmit}
      />
      <PAppContainer>
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
          value={description ?? ''}
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
        {localMediaPath && (
          <Image source={{ uri: localMediaPath }} style={styles.postImage} />
        )}
        {categories && categories.length > 0 && (
          <FlatList
            horizontal
            data={categories}
            renderItem={({ item }) => (
              <Tag label={PostCategories[item]} viewStyle={styles.tagStyle} />
            )}
            listKey="category"
          />
        )}
      </PAppContainer>
    </SafeAreaView>
  );
};

export default ReviewPost;

const styles = StyleSheet.create({
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
  tagStyle: {
    paddingHorizontal: 15,
    marginRight: 8,
    borderRadius: 16,
  },
});
