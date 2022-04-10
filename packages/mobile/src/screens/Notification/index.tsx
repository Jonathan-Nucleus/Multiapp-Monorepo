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
import { CaretLeft } from 'phosphor-react-native';
import { BGDARK, GRAY2, GRAY100, WHITE, BLACK, GRAY } from 'shared/src/colors';

import PHeader from '../../components/common/PHeader';
import pStyles from '../../theme/pStyles';
import { Body1, Body2, Body3 } from '../../theme/fonts';
import ThreeDortSvg from '../../assets/icons/three-dot.svg';
import SearchSvg from '../../assets/icons/search.svg';
import ChatCenteredTextSvg from '../../assets/icons/ChatCenteredText.svg';
import Avatar from '../../assets/avatar.png';

import type { NotificationScreen } from 'mobile/src/navigations/NotificationStack';

const DATA = [
  {
    id: '1',
    label1: 'Jane onething commented on your post. 2h',
    label2: 'Lorem ipsum dolor sit amet, consectetur...',
  },
  {
    id: '2',
    label1: 'Jane onething commented on your post. 2h',
    label2: 'Lorem ipsum dolor sit amet, consectetur...',
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
  const renderRight = (): ReactElement => {
    return (
      <View style={styles.row}>
        <TouchableOpacity>
          <ThreeDortSvg />
        </TouchableOpacity>
        <TouchableOpacity>
          <SearchSvg />
        </TouchableOpacity>
      </View>
    );
  };
  const renderLeft = (): ReactElement => {
    return (
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CaretLeft size={28} color={GRAY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>
    );
  };

  const renderListItem: ListRenderItem<typeof DATA[number]> = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Detail')}>
        <View style={styles.item}>
          <View>
            <Image source={Avatar} style={styles.avatar} />
            <View style={styles.chat}>
              <ChatCenteredTextSvg />
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
    <SafeAreaView style={pStyles.globalContainer}>
      <PHeader
        leftIcon={renderLeft()}
        rightIcon={renderRight()}
        containerStyle={styles.headerContainer}
      />
      <FlatList
        data={DATA}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BGDARK,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    paddingTop: 0,
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    ...Body1,
    color: WHITE,
  },
  flatList: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
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
    backgroundColor: GRAY2,
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
    padding: 8,
    borderRadius: 8,
    borderColor: GRAY2,
    borderWidth: 1,
    marginBottom: 8,
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
});
