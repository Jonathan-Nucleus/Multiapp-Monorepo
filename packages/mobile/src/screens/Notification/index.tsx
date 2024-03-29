import React, { ReactElement, useEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ListRenderItem,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  Checks,
  DotsThreeOutlineVertical,
  ChatCenteredText,
  UserCirclePlus,
  CaretLeft,
  ThumbsUp,
  At,
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
  PRIMARYSOLID,
} from 'shared/src/colors';
import Modal from 'react-native-modal';
import moment from 'moment';

import pStyles from 'mobile/src/theme/pStyles';
import { Body1, Body2, Body3, H5Bold } from 'mobile/src/theme/fonts';

import Avatar from 'mobile/src/components/common/Avatar';
import MainHeader from 'mobile/src/components/main/Header';

import {
  useNotificationsContext,
  Notification,
} from 'shared/context/Notifications';
import {
  useReadNotification,
  useReadNotifications,
  useSeenNotifications,
} from 'shared/graphql/mutation/notification';

import type { NotificationScreen } from 'mobile/src/navigations/AuthenticatedStack';

const Notifications: NotificationScreen = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetchItemId, setLastFetchItemId] = useState<string>();
  const { notifications, refetch, fetchMore, loading } =
    useNotificationsContext();
  const [readNotification] = useReadNotification();
  const [readNotifications] = useReadNotifications();
  const [seenNotifications] = useSeenNotifications();

  useEffect(() => {
    try {
      seenNotifications();
      refetch();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const renderIcon = (val: Notification): ReactElement => {
    switch (val.type) {
      case 'COMMENT_POST':
      case 'CREATE_POST':
        return <ChatCenteredText size={18} color={WHITE} />;
      case 'LIKE_POST':
        return <ThumbsUp size={18} color={WHITE} />;
      case 'TAGGED_IN_POST':
      case 'TAGGED_IN_COMMENT':
        return <At size={18} color={WHITE} />;
      case 'FOLLOWED_BY_USER':
      case 'FOLLOWED_BY_COMPANY':
        return <UserCirclePlus size={18} color={WHITE} />;
    }
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleReadNotification = async (
    notification: Notification,
  ): Promise<void> => {
    const { _id, type, data: notificationData, isRead } = notification;
    try {
      if (!isRead) {
        await readNotification({
          variables: {
            notificationId: _id,
          },
        });
        refetch();
      }

      if (
        (type === 'COMMENT_POST' ||
          type === 'LIKE_POST' ||
          type === 'TAGGED_IN_POST' ||
          type === 'TAGGED_IN_COMMENT' ||
          type === 'CREATE_POST') &&
        notificationData.postId
      ) {
        navigation.navigate('PostDetails', {
          screen: 'PostDetail',
          params: {
            postId: notificationData.postId,
          },
        });
      } else if (type === 'FOLLOWED_BY_USER') {
        navigation.navigate('UserDetails', {
          screen: 'UserProfile',
          params: {
            userId: notificationData.userId,
          },
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsVisible(false);
    }
  };

  const handleReadAllNotifications = async (): Promise<void> => {
    try {
      await readNotifications();
      refetch();
    } catch (err) {
      console.log(err);
    } finally {
      setIsVisible(false);
    }
  };

  const renderListItem: ListRenderItem<typeof notifications[number]> = ({
    item,
  }) => {
    return (
      <Pressable
        style={({ pressed }) => (pressed ? styles.pressedState : null)}
        onPress={() => handleReadNotification(item)}>
        <View style={styles.item}>
          <View style={styles.avatarView}>
            {!item.isRead && <View style={styles.dot} />}
            <Avatar size={54} user={item.data.user} />
            <View style={styles.chat}>{renderIcon(item)}</View>
          </View>
          <View style={styles.commentWrap}>
            <Text style={styles.label}>{item.body}</Text>
            <Text style={styles.comment}>
              {moment(item.createdAt).fromNow()}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };
  const onEndReached = (): void => {
    const lastItem = notifications[notifications.length - 1]._id;
    if (lastFetchItemId !== lastItem) {
      setLastFetchItemId(lastItem);
      fetchMore({
        variables: {
          before: lastItem,
        },
      });
    }
  };

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        onPressLeft={navigation.goBack}
      />
      <View style={[styles.row, styles.between]}>
        <Text style={styles.title}>Notifications</Text>
        <Pressable
          onPress={() => setIsVisible(true)}
          style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}>
          <DotsThreeOutlineVertical size={28} color={GRAY100} weight="fill" />
        </Pressable>
      </View>
      <FlatList
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        data={notifications}
        renderItem={renderListItem}
        keyExtractor={(item) => item._id}
        style={styles.flatList}
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={refreshing}
            colors={[WHITE]}
            tintColor={WHITE}
          />
        }
        ListFooterComponent={() =>
          loading ? (
            <ActivityIndicator
              style={styles.activityIndicator}
              size="small"
              color={WHITE}
              animating={true}
            />
          ) : (
            <></>
          )
        }
      />
      <Modal
        isVisible={isVisible}
        swipeDirection="down"
        onBackdropPress={() => setIsVisible(false)}
        style={styles.bottomHalfModal}>
        <View style={styles.modalContent}>
          <Pressable
            style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}
            onPress={() => handleReadAllNotifications()}>
            <View style={styles.row}>
              <Checks color={WHITE} size={28} />
              <View style={styles.commentWrap}>
                <Text style={styles.label}>Mark All as Read</Text>
              </View>
            </View>
          </Pressable>
          {/* Hide preferences for now until they are properly hooked up.
            <Pressable
            style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}
            onPress={() => {
              setIsVisible(false);
              navigation.navigate('Preferences');
            }}>
            <View style={styles.row}>
              <Gear color={WHITE} size={28} />
              <View style={styles.commentWrap}>
                <Text style={styles.label}>Notification Settings</Text>
              </View>
            </View>
          </Pressable>
          */}
          <Pressable
            style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}
            onPress={() => setIsVisible(false)}>
            <View style={styles.btn}>
              <Text style={styles.btnTxt}>Cancel</Text>
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  pressedState: {
    backgroundColor: BLUE500,
  },
  flatList: {
    flex: 1,
    marginTop: 16,
  },
  activityIndicator: {
    marginVertical: 40,
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
    backgroundColor: PRIMARYSOLID,
  },
  avatarView: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
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
