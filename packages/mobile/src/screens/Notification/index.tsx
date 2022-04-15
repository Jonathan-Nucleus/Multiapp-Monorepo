import React, { ReactElement, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Gear,
  Checks,
  Chats,
  DotsThreeOutlineVertical,
} from 'phosphor-react-native';
import {
  PRIMARYSTATE,
  GRAY2,
  GRAY100,
  WHITE,
  BLACK,
  BGDARK,
  PRIMARY,
  BLUE500,
} from 'shared/src/colors';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

import pStyles from '../../theme/pStyles';
import { Body1, Body2, Body3, H5GothamBold } from '../../theme/fonts';
import Avatar from '../../assets/avatar.png';

import type { NotificationScreen } from 'mobile/src/navigations/NotificationStack';
import MainHeader from '../../components/main/Header';

const DATA = [
  {
    id: '1',
    label1: 'Jane onething commented on your post. 2h',
    label2: 'Lorem ipsum dolor sit amet, consectetur...',
    unRead: true,
  },
  {
    id: '2',
    label1: 'Jane onething commented on your post. 2h',
    label2: 'Lorem ipsum dolor sit amet, consectetur...',
    unRead: true,
  },
  {
    id: '3',
    label1: 'Jane onething commented on your post. 2h',
    label2: 'Lorem ipsum dolor sit amet, consectetur...',
  },
  {
    id: '4',
    label1: 'Jane onething commented on your post. 2h',
    label2: 'Lorem ipsum dolor sit amet, consectetur...',
  },
  {
    id: '5',
    label1: 'Jane onething commented on your post. 2h',
    label2: 'Lorem ipsum dolor sit amet, consectetur...',
  },
  {
    id: '6',
    label1: 'Jane onething commented on your post. 2h',
    label2: 'Lorem ipsum dolor sit amet, consectetur...',
  },
  {
    id: '7',
    label1: 'Jane onething commented on your post. 2h',
    label2: 'Lorem ipsum dolor sit amet, consectetur...',
  },
  {
    id: '8',
    label1: 'Jane onething commented on your post. 2h',
    label2: 'Lorem ipsum dolor sit amet, consectetur...',
  },
];

const Notification: NotificationScreen = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);

  const renderListItem: ListRenderItem<typeof DATA[number]> = ({ item }) => {
    return (
      <TouchableOpacity onLongPress={() => setIsVisible(true)}>
        <View style={[styles.item, item.unRead && styles.unRead]}>
          <View style={styles.avatarView}>
            {item.unRead && (
              <LinearGradient
                colors={['#844AFF', '#00AAE0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dot}
              />
            )}
            <Image source={Avatar} style={styles.avatar} />
            <View style={styles.chat}>
              <Chats color={WHITE} size={14} />
            </View>
          </View>
          <View style={styles.commentWrap}>
            <Text style={styles.label}>{item.label1}</Text>
            <Text numberOfLines={1} style={styles.comment}>
              {item.label2}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader />
      <View style={[styles.row, styles.between]}>
        <Text style={styles.title}>Notifications</Text>
        <DotsThreeOutlineVertical size={28} color={GRAY100} weight="fill" />
      </View>
      <FlatList
        data={DATA}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />
      <Modal
        isVisible={isVisible}
        swipeDirection="down"
        onBackdropPress={() => setIsVisible(false)}
        style={styles.bottomHalfModal}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => setIsVisible(false)}>
            <View style={styles.row}>
              <Checks color={WHITE} size={28} />
              <View style={styles.commentWrap}>
                <Text style={styles.label}>Mark All as Read</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsVisible(false)}>
            <View style={styles.row}>
              <Gear color={WHITE} size={28} />
              <View style={styles.commentWrap}>
                <Text style={styles.label}>Notification Settins</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsVisible(false)}>
            <View style={styles.btn}>
              <Text style={styles.btnTxt}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  headerTitle: {
    ...Body1,
    color: WHITE,
  },
  flatList: {
    flex: 1,
    marginTop: 16,
  },
  avatar: {
    width: 54,
    height: 54,
  },
  chat: {
    position: 'absolute',
    bottom: -2,
    right: -8,
    width: 24,
    height: 24,
    backgroundColor: PRIMARYSTATE,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    elevation: 1,
    shadowColor: BLACK,
    shadowOpacity: 0.5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: GRAY2,
    borderBottomWidth: 1,
    padding: 24,
  },
  commentWrap: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    ...Body2,
    color: WHITE,
  },
  comment: {
    color: GRAY100,
    ...Body3,
  },
  modalContent: {
    backgroundColor: BGDARK,
    padding: 20,
    borderRadius: 32,
  },
  btnTxt: {
    color: WHITE,
    ...Body1,
    textAlign: 'center',
  },
  bottomHalfModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  btn: {
    padding: 12,
    borderRadius: 32,
    borderColor: PRIMARY,
    borderWidth: 1,
    marginVertical: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
    position: 'absolute',
    right: 55,
    top: 27,
  },
  avatarView: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  unRead: {
    backgroundColor: BLUE500,
  },
  title: {
    ...H5GothamBold,
    color: WHITE,
  },
  between: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});
