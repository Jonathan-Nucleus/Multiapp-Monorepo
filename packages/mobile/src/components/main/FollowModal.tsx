import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  ListRenderItem,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';

import UserInfo from 'mobile/src/components/common/UserInfo';
import { Body2Bold } from 'mobile/src/theme/fonts';
import pStyles from 'mobile/src/theme/pStyles';
import { WHITE, WHITE60, PRIMARYSTATE, BLACK } from 'shared/src/colors';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

import type { UserProfile } from 'backend/graphql/users.graphql';

const APP_WIDTH = Dimensions.get('window').width;
const APP_HEIGHT = Dimensions.get('window').height;

interface ModalProps {
  tab?: string;
  isVisible: boolean;
  onClose: () => void;
  following: UserProfile[];
  followers: UserProfile[];
}

const FollowModal: FC<ModalProps> = ({
  tab,
  isVisible,
  followers,
  following,
  onClose,
}) => {
  const [currentTab, setCurrentTab] = useState('follower');

  useEffect(() => {
    setCurrentTab(tab || 'follower');
  }, [tab]);

  const members = useMemo(() => {
    if (currentTab === 'follower') {
      return followers;
    }
    return following;
  }, [currentTab, followers, following]);

  const goToProfile = (userId: string): void => {
    NavigationService.navigate('UserDetails', {
      screen: 'UserProfile',
      params: {
        userId,
      },
    });
  };

  const renderItem: ListRenderItem<typeof members[number]> = ({ item }) => {
    return (
      <Pressable
        onPress={() => {
          onClose();
          setTimeout(() => goToProfile(item._id), 200);
        }}
        style={({ pressed }) => (pressed ? pStyles.pressedStyle : {})}>
        <UserInfo user={item} avatarSize={32} showFollow={false} />
      </Pressable>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationInTiming={400}
      animationOut="slideOutDown"
      animationOutTiming={400}
      onBackdropPress={() => onClose()}
      style={styles.bottomHalfModal}
      propagateSwipe={true}
      backdropOpacity={0.5}>
      <View style={styles.modalContent}>
        <View style={pStyles.modalKnobContainer}>
          <View style={pStyles.modalKnob} />
        </View>
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
    maxHeight: APP_HEIGHT - 100,
    height: APP_HEIGHT * 0.6,
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
    width: (APP_WIDTH - 40) / 2,
    alignItems: 'center',
  },
  selectedTab: {
    borderBottomColor: PRIMARYSTATE,
    borderBottomWidth: 2,
  },
  flatList: { marginBottom: 80 },
});
