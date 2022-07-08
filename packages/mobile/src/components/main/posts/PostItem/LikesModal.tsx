import React, { FC } from 'react';
import {
  ListRenderItem,
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';

import UserInfo from 'mobile/src/components/common/UserInfo';
import PLabel from 'mobile/src/components/common/PLabel';
import { BLACK, WHITE12, WHITE } from 'shared/src/colors';
import { Body1Bold } from 'mobile/src/theme/fonts';
import pStyles from 'mobile/src/theme/pStyles';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

import { usePostLikes, Like } from 'shared/graphql/query/post/usePostLikes';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  postId: string;
}

const LikesModal: FC<ModalProps> = ({ isVisible, postId, onClose }) => {
  const { data: { post } = {}, loading } = usePostLikes(postId);
  const { likes = [] } = post || {};

  const goToProfile = (userId: string): void => {
    NavigationService.navigate('UserDetails', {
      screen: 'UserProfile',
      params: {
        userId,
      },
    });
  };

  const renderItem: ListRenderItem<Like> = ({ item: user }) => {
    return (
      <Pressable
        onPress={() => {
          onClose();
          setTimeout(() => goToProfile(user._id), 200);
        }}
        style={({ pressed }) => (pressed ? pStyles.pressedStyle : {})}>
        <UserInfo user={user} avatarSize={32} showFollow={false} />
      </Pressable>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      swipeDirection="down"
      onBackdropPress={() => onClose()}
      style={styles.bottomHalfModal}
      propagateSwipe={true}
      backdropOpacity={0.5}>
      <View style={styles.modalContent}>
        <View style={pStyles.modalKnobContainer}>
          <View style={pStyles.modalKnob} />
        </View>
        <ScrollView>
          {likes.length === 0 && loading ? (
            <View style={styles.progressView}>
              <ActivityIndicator color={WHITE} size={16} />
            </View>
          ) : (
            <View onStartShouldSetResponder={() => true}>
              <FlatList
                data={likes}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                nestedScrollEnabled
                scrollEnabled={false}
                style={styles.flatList}
                ListHeaderComponent={() => (
                  <PLabel
                    label={`${likes.length} ${
                      likes.length === 1 ? 'Like' : 'Likes'
                    }`}
                    textStyle={styles.likeCountLabel}
                  />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default LikesModal;

const styles = StyleSheet.create({
  bottomHalfModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: BLACK,
    padding: 20,
    borderRadius: 32,
    maxHeight: Dimensions.get('screen').height - 100,
    justifyContent: 'center',
  },
  likeCountLabel: {
    ...Body1Bold,
    marginBottom: 16,
  },
  flatList: {
    marginBottom: 24,
  },
  separator: {
    height: 1,
    backgroundColor: WHITE12,
  },
  progressView: {
    paddingBottom: 24,
  },
});
