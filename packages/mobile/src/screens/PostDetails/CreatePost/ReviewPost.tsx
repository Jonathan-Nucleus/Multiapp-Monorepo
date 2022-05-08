import React from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
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
import { SECONDARY } from 'shared/src/colors';

import PostSelection from './PostSelection';
import PostHeader from './PostHeader';
import { AUDIENCE_OPTIONS } from './index';

import { useAccount } from 'mobile/src/graphql/query/account';
import {
  useCreatePost,
  PostCategories,
  useEditPost,
} from 'mobile/src/graphql/mutation/posts';

import { ReviewPostScreen } from 'mobile/src/navigations/PostDetailsStack';

const ReviewPost: ReviewPostScreen = ({ route, navigation }) => {
  const { data: accountData } = useAccount();
  const [createPost] = useCreatePost();
  const [editPost] = useEditPost();

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
    let postData = {
      categories,
      audience,
      body: description,
      mediaUrl,
      mentionIds: mentions,
      // TODO: Update endpoint to accept company
    };

    if (route.params?.editPost) {
      const id = route.params?.id;
      postData = { ...postData, _id: id };
      const result = await editPost({
        variables: {
          post: postData,
        },
      });

      if (result && result.data && result.data.editPost) {
        showMessage('success', 'Successfully edited!');
        navigation.pop(2);
        // it should go to different stack
        navigation.navigate('Main');
      }
    } else {
      const result = await createPost({
        variables: {
          post: postData,
        },
      });

      if (result && result.data && result.data.createPost) {
        showMessage('success', 'Successfully posted!');
        navigation.pop(2);
        // it should go to different stack
        navigation.navigate('Main');
      }
    }
  };

  const postAsLabel =
    account?._id === user
      ? `${account?.firstName} ${account?.lastName}`
      : account?.companies.find((company) => company._id === user)?.name ?? '';
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
        {localMediaPath ? (
          <Image source={{ uri: localMediaPath }} style={styles.postImage} />
        ) : (
          route.params?.mediaUrl && (
            <Image
              source={{ uri: `${POST_URL}/${route.params?.mediaUrl}` }}
              style={styles.postImage}
            />
          )
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
