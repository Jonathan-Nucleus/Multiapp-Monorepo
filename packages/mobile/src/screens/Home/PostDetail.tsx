import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AVATAR_URL } from 'react-native-dotenv';
import { SafeAreaView } from 'react-native-safe-area-context';

import PAppContainer from '../../components/common/PAppContainer';
import PLabel from '../../components/common/PLabel';
import PostItem from '../../components/main/PostItem';
import { PostDetailScreen } from '../../navigations/HomeStack';
import UserInfo from '../../components/common/UserInfo';
import { CaretLeft, PaperPlaneRight } from 'phosphor-react-native';
import PHeader from '../../components/common/PHeader';
import * as NavigationService from '../../services/navigation/NavigationService';

import { BLACK, WHITE } from 'shared/src/colors';
import pStyles from '../../theme/pStyles';

import { useCommentPost } from '../../graphql/mutation/posts';
import { usePost } from '../../graphql/query/post';

const PostDetail: PostDetailScreen = ({ route }) => {
  const [comment, setComment] = useState('');
  const { post, userId } = route.params;
  const { data, refetch } = usePost(post._id);
  const [commentPost] = useCommentPost();
  const comments = data?.post?.comments;

  const CommentItem = ({ item }) => {
    const { user, body } = item;
    return (
      <View>
        <UserInfo
          avatar={{ uri: `${AVATAR_URL}/${user.avatar}` }}
          name={`${user.firstName} ${user.lastName}`}
          company={user.company?.name}
          avatarSize={32}
          isPro
        />
        <PLabel label={body} viewStyle={styles.sendBtn} />
      </View>
    );
  };

  const addComment = async () => {
    try {
      const { data } = await commentPost({
        variables: {
          comment: {
            body: comment,
            postId: post._id,
            mentionIds: [],
          },
        },
      });

      if (data?.comment) {
        setComment('');
        refetch();
      }
    } catch (err) {
      console.log('add comment error:', err);
    }
  };

  const renderItem = ({ item }) => <CommentItem item={item} />;

  return (
    <SafeAreaView
      style={pStyles.globalContainer}
      edges={['right', 'top', 'left']}>
      <PHeader
        leftIcon={<CaretLeft size={32} color={WHITE} />}
        leftStyle={styles.sideStyle}
        onPressLeft={() => NavigationService.goBack()}
        containerStyle={styles.headerContainer}
      />
      <PAppContainer style={styles.container}>
        <PostItem post={post} userId={userId} />
        <FlatList data={comments || []} renderItem={renderItem} />
        <View style={styles.inputContainer}>
          <TextInput
            value={comment}
            onChangeText={setComment}
            multiline
            style={styles.input}
          />
          <TouchableOpacity onPress={addComment}>
            <PaperPlaneRight size={32} color={WHITE} />
          </TouchableOpacity>
        </View>
      </PAppContainer>
    </SafeAreaView>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  headerContainer: {
    backgroundColor: BLACK,
    marginBottom: 0,
    height: 62,
  },
  sideStyle: {
    top: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  input: {
    backgroundColor: WHITE,
    padding: 11,
    paddingTop: 11, // important
    minHeight: 36,
    borderRadius: 24,
    width: '90%',
  },
  sendBtn: {
    marginLeft: 40,
  },
});
