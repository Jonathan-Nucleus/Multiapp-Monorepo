import React, { ReactElement, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import {
  Gear,
  Checks,
  Chats,
  DotsThreeOutlineVertical,
  ChatCenteredText,
  ThumbsUp,
  UserCirclePlus,
  At,
  Share,
  CaretLeft,
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
  WHITE60,
} from 'shared/src/colors';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

import pStyles from 'mobile/src/theme/pStyles';
import { Body1, Body2, Body3, H5Bold } from 'mobile/src/theme/fonts';

import Avatar from 'mobile/src/components/common/Avatar';
import MainHeader from 'mobile/src/components/main/Header';

import type { NotificationScreen } from 'mobile/src/navigations/AppNavigator';

const Items: Notification[] = [
  /*{
    name: 'Mike Wang',
    description: 'Founder, Investor ',
    company: 'Cartenna Capital',
    image: Avatar,
    id: '1',
    unread: false,
    lastMessage: 'What a great idea!',
    liked: true,
    createdAt: new Date('Thu Apr 10 2022 19:30:03 GMT-0600'),
  },
  {
    name: 'Mike Wang',
    description: 'Founder, Investor ',
    company: 'Cartenna Capital',
    image: Avatar,
    id: '51',
    unread: false,
    lastMessage:
      'Sure, I’ll send over the terms and conditions. What’s your name',
    createdAt: new Date('Thu Apr 10 2022 18:30:03 GMT-0600'),
  },
  {
    name: 'Mike Wang',
    description: 'Founder, Investor ',
    company: 'Cartenna Capital',
    image: Avatar,
    id: '41',
    unread: true,
    lastMessage: 'Richard Branson - this is what I was talking about.',
    commented: true,
    createdAt: new Date('Thu Apr 05 2022 18:30:03 GMT-0600'),
  },
  {
    name: 'Mike Wang',
    description: 'Founder, Investor ',
    company: 'Cartenna Capital',
    image: Avatar,
    id: '31',
    unread: true,
    following: true,
    createdAt: new Date('Thu Apr 05 2022 20:30:03 GMT-0600'),
  },
  {
    name: 'Mike Wang',
    description: 'Founder, Investor ',
    company: 'Cartenna Capital',
    image: Avatar,
    id: '21',
    unread: true,
    shared: true,
    createdAt: new Date('Thu Apr 11 2022 21:22:03 GMT-0600'),
  },
  {
    name: 'Mike Wang',
    description: 'Founder, Investor ',
    company: 'Cartenna Capital',
    image: Avatar,
    id: '11',
    unread: true,
    message: true,
    createdAt: new Date('Thu Apr 11 2022 20:30:03 GMT-0600'),
  },
  {
    name: 'Robert Fox',
    description: 'Founder, Investor ',
    company: 'Cartenna Capital',
    image: Avatar,
    id: '121',
    unread: true,
    mentioned: true,
    lastMesae: 'Richard Branson - this is what I was talking about.',
    createdAt: new Date('Thu Apr 11 2022 17:30:03 GMT-0600'),
  },*/
];

interface Notification {
  name: string;
  image: string;
  id: string;
  unread: boolean;
  mentioned?: boolean;
  commented?: boolean;
  liked?: boolean;
  message?: boolean;
  following?: boolean;
  shared?: boolean;
  lastMessage?: string;
  createdAt: Date;
}

const Notification: NotificationScreen = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);

  const title = (val: Notification) => {
    if (val.commented) {
      return `${val.name} commented on your post`;
    }
    if (val.liked) {
      return `${val.name} liked your post`;
    }
    if (val.message) {
      return `${val.name} sent you a message`;
    }
    if (val.following) {
      return `${val.name} is following you`;
    }
    if (val.mentioned) {
      return `${val.name} mentioned you in a comment`;
    }
    if (val.shared) {
      return `${val.name} shared your post`;
    }
    return `${val.name} sent you a message`;
  };

  const renderIcon = (val: Notification) => {
    if (val.commented) {
      return <ChatCenteredText size={18} color={WHITE} />;
    }
    if (val.liked) {
      return <ThumbsUp size={18} color={WHITE} />;
    }
    if (val.message) {
      return <Chats size={18} color={WHITE} />;
    }
    if (val.following) {
      return <UserCirclePlus size={18} color={WHITE} />;
    }
    if (val.mentioned) {
      return <At size={18} color={WHITE} />;
    }
    if (val.shared) {
      return <Share size={18} color={WHITE} />;
    }
    return <Chats size={18} color={WHITE} />;
  };

  const renderListItem: ListRenderItem<typeof Items[number]> = ({ item }) => {
    return (
      <TouchableOpacity onLongPress={() => setIsVisible(true)}>
        <View style={[styles.item, item.unread && styles.unread]}>
          <View style={styles.avatarView}>
            {item.unread && (
              <LinearGradient
                colors={['#844AFF', '#00AAE0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dot}
              />
            )}
            <Avatar size={54} />
            <View style={styles.chat}>{renderIcon(item)}</View>
          </View>
          <View style={styles.commentWrap}>
            <Text style={styles.label}>{title(item)}</Text>
            <Text numberOfLines={1} style={styles.comment}>
              {item.lastMessage}
            </Text>
            <Text style={styles.comment}>
              {moment(item.createdAt).fromNow()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        onPressLeft={navigation.goBack}
      />
      <View style={[styles.row, styles.between]}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <DotsThreeOutlineVertical size={28} color={GRAY100} weight="fill" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={Items}
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
    color: WHITE60,
    ...Body3,
    marginTop: 4,
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
  unread: {
    backgroundColor: BLUE500,
  },
  title: {
    ...H5Bold,
    color: WHITE,
  },
  between: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});
