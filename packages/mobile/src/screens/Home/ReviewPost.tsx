import React, { useEffect, useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MentionInput,
  replaceMentionValues,
} from 'react-native-controlled-mentions';
import { useMutation } from '@apollo/client';
import _ from 'lodash';

import PAppContainer from '../../components/common/PAppContainer';
import RoundImageView from '../../components/common/RoundImageView';
import PostSelection from './PostSelection';
import pStyles from '../../theme/pStyles';
import { SECONDARY } from 'shared/src/colors';
import { CREATE_POST, PostDataType, UPLOAD_LINK } from '../../graphql/post';
import { ReviewPostScreen } from 'mobile/src/navigations/HomeStack';
import { showMessage } from '../../services/utils';
import { SOMETHING_WRONG } from 'shared/src/constants';

import UserSvg from 'shared/assets/images/user.svg';
import GlobalSvg from 'shared/assets/images/global.svg';
import Avatar from '../../assets/avatar.png';
import Tag from '../../components/common/Tag';
import PostHeader from './PostHeader';
import { audienceData, OptionProps, postAsData } from './CreatePost';

const ReviewPost: ReviewPostScreen = ({ route, navigation }) => {
  const [selectedPostAs] = useState<OptionProps>(postAsData[0]);
  const [selectedAudience] = useState<OptionProps>(audienceData[0]);
  const [imageData, setImageData] = useState<any>({});
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [createPost] = useMutation(CREATE_POST);
  const [uploadLink] = useMutation(UPLOAD_LINK);

  useEffect(() => {
    const { categories, description, mentions, imageData } = route.params;
    setDescription(description);
    setMentions(mentions);
    setCategories(categories);
    setImageData(imageData);
  }, [route, route.params]);

  const checkValidation = () => {
    if (!description || !imageData || !categories) {
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!checkValidation()) {
      return;
    }

    try {
      const { data } = await uploadLink({
        variables: {
          localFilename: imageData?.filename,
          type: 'POST',
        },
      });

      if (!data || !data.uploadLink) {
        showMessage('error', 'Image upload failed');
        return;
      }

      const { remoteName, uploadUrl } = data.uploadLink;
      const formdata = new FormData();
      if (imageData != null) {
        const uri =
          Platform.OS === 'ios' ? `file:///${imageData.path}` : imageData.path;
        formdata.append('uri', uri);
        formdata.append('type', imageData.mime);
        formdata.append('name', imageData.filename);
      }

      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: formdata,
      });

      const postData: PostDataType = {
        categories,
        audience: selectedAudience.val.toUpperCase(),
        body: replaceMentionValues(description, ({ name }) => `@${name}`),
        mediaUrl: remoteName,
        mentionIds: mentions,
      };

      const result = (
        await createPost({
          variables: {
            post: postData,
          },
        })
      ).data.createPost;
      console.log('success', result);
      showMessage('success', 'Successfully posted!');
    } catch (e) {
      console.log('error', e);
      showMessage('error', SOMETHING_WRONG);
    }
  };

  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PostHeader
        centerLabel="Preview Post"
        rightLabel="POST"
        rightValidation={checkValidation()}
        handleNext={handleNext}
      />
      <PAppContainer>
        <View style={styles.usersPart}>
          <RoundImageView image={Avatar} imageStyle={styles.avatarImage} />
          <PostSelection
            icon={<UserSvg />}
            label={selectedPostAs?.val}
            viewStyle={{ marginHorizontal: 8 }}
          />
          <PostSelection icon={<GlobalSvg />} label={selectedAudience?.val} />
        </View>
        <MentionInput
          value={description}
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
        {!_.isEmpty(imageData) && (
          <Image source={{ uri: imageData.path }} style={styles.postImage} />
        )}
        {categories && categories.length > 0 && (
          <FlatList
            horizontal
            data={categories}
            renderItem={({ item }) => (
              <Tag label={item} viewStyle={styles.tagStyle} />
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
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
