import React, { FC } from 'react';
import {
  ListRenderItem,
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';

import UserInfo from 'mobile/src/components/common/UserInfo';
import PLabel from 'mobile/src/components/common/PLabel';
import { BGDARK, GRAY800, WHITE12 } from 'shared/src/colors';
import { Body1Bold } from 'mobile/src/theme/fonts';

import type { Like } from 'mobile/src/graphql/query/post';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  likes: Like[];
}

const LikesModal: FC<ModalProps> = ({ isVisible, likes, onClose }) => {
  const renderItem: ListRenderItem<Like> = ({ item: user }) => {
    return <UserInfo user={user} avatarSize={32} />;
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
        <View style={styles.modalKnobContainer}>
          <View style={styles.modalKnob} />
        </View>
        <ScrollView>
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
                  label={`${likes?.length?.toString()} Likes`}
                  textStyle={styles.likeCountLabel}
                />
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
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
    backgroundColor: BGDARK,
    padding: 20,
    borderRadius: 32,
    maxHeight: Dimensions.get('screen').height - 100,
    justifyContent: 'center',
  },
  likeCountLabel: {
    ...Body1Bold,
    marginBottom: 16,
  },
  flatList: { marginBottom: 24 },
  separator: {
    height: 1,
    backgroundColor: WHITE12,
  },
  modalKnobContainer: {
    alignItems: 'center',
  },
  modalKnob: {
    width: 72,
    height: 8,
    borderRadius: 30,
    backgroundColor: GRAY800,
  },
});
