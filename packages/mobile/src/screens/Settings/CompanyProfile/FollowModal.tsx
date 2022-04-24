import React, { FC, useMemo, useState } from 'react';
import {
  ListRenderItem,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { AVATAR_URL } from 'react-native-dotenv';

import UserInfo from '../../../components/common/UserInfo';
import { Body2Bold } from '../../../theme/fonts';
import { WHITE, WHITE60, PRIMARYSTATE, BLACK } from 'shared/src/colors';
import type { UserProfile } from 'backend/graphql/users.graphql';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  following: UserProfile[];
  followers: UserProfile[];
}

const FollowModal: FC<ModalProps> = ({
  isVisible,
  followers,
  following,
  onClose,
}) => {
  const [currentTab, setCurrentTab] = useState('follower');

  const members = useMemo(() => {
    if (currentTab === 'follower') {
      return followers;
    }
    return following;
  }, [currentTab, followers, following]);

  const renderItem: ListRenderItem<typeof members[number]> = ({ item }) => {
    return (
      <UserInfo
        avatar={{ uri: `${AVATAR_URL}/${item.avatar}` }}
        name={`${item.firstName} ${item.lastName}`}
        role={item.position}
        company={item.company?.name}
        avatarSize={32}
        isPro
      />
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
        <View style={styles.topTab}>
          <TouchableOpacity onPress={() => setCurrentTab('follower')}>
            <View
              style={[
                styles.tab,
                currentTab === 'follower' && styles.selectedTab,
              ]}>
              <Text
                style={[
                  styles.tabLabel,
                  currentTab === 'follower' && styles.selectedTabLabel,
                ]}>
                Followers
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentTab('following')}>
            <View
              style={[
                styles.tab,
                currentTab === 'following' && styles.selectedTab,
              ]}>
              <Text
                style={[
                  styles.tabLabel,
                  currentTab === 'following' && styles.selectedTabLabel,
                ]}>
                Following
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <ScrollView>
            <View onStartShouldSetResponder={() => true}>
              <FlatList
                data={members}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                horizontal={false}
                keyboardShouldPersistTaps="always"
                nestedScrollEnabled
                scrollEnabled={false}
                style={styles.flatList}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FollowModal;

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
  },
  topTab: {
    flexDirection: 'row',
    height: 48,
  },
  tabLabel: {
    color: WHITE60,
    ...Body2Bold,
  },
  selectedTabLabel: {
    color: WHITE,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 25,
  },
  selectedTab: {
    borderBottomColor: PRIMARYSTATE,
    borderBottomWidth: 2,
  },
  flatList: { marginBottom: 80 },
});
