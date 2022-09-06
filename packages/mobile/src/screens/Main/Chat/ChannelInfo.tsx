import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import pStyles from '../../../theme/pStyles';
import PHeader from '../../../components/common/PHeader';
import { WHITE, WHITE12 } from 'shared/src/colors';
import { ChannelInfoScreen } from '../../../navigations/ChatStack';
import { CommonActions } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import { Body1, Body1Bold } from '../../../theme/fonts';
import { User } from 'mobile/src/services/chat';
import UserItem from '../../../components/main/chat/UserItem';
import PWhiteOutlineButton from '../../../components/common/PWhiteOutlineButton';

const ChannelInfo: ChannelInfoScreen = ({ navigation, route }) => {
  const { usersNo, userInfos, channel, userId } = route.params || {};

  const backToChannelList = (): void => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Channel' },
          { name: 'Channel', params: route.params },
        ],
      }),
    );
    navigation.goBack();
  };

  const renderItem: ListRenderItem<User> = ({ item }) => (
    <UserItem
      user={item}
      onPress={() =>
        navigation.navigate('UserDetails', {
          screen: 'UserProfile',
          params: {
            userId: item.id,
          },
        })
      }
      selectedUsers={[]}
    />
  );

  return (
    <View style={pStyles.globalContainer}>
      <PHeader
        leftIcon={
          <Pressable
            onPress={backToChannelList}
            style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}>
            <CaretLeft size={32} color={WHITE} />
          </Pressable>
        }
        centerIcon={
          <View style={styles.headerTitleContainer} pointerEvents="none">
            <Text style={styles.headerText}>
              {usersNo > 1 ? 'Group Chat Info' : 'Chat Info'}
            </Text>
          </View>
        }
        outerContainerStyle={styles.header}
      />
      {usersNo > 1 ? (
        <View style={styles.participants}>
          <Text style={styles.membersText}>
            {usersNo.toString() + ' Participants'}
          </Text>
        </View>
      ) : null}
      <View style={styles.participantsList}>
        <FlatList
          data={userInfos}
          renderItem={renderItem}
          keyExtractor={(item) => `${item?.id}`}
          ItemSeparatorComponent={() => (
            <View style={styles.participantsSeparator} />
          )}
        />
      </View>
      {usersNo > 1 ? null : <View style={styles.conditionalSpacing} />}
      <View style={styles.buttonsContainer}>
        <PWhiteOutlineButton
          label={usersNo > 1 ? 'Archive Group Chat' : 'Archive Chat'}
          onPress={async () => {
            await channel.current.hide();
            navigation.pop(2);
          }}
          outlineContainer={styles.button}
        />
        {usersNo > 1 ? (
          <PWhiteOutlineButton
            label={'Leave Group'}
            onPress={async () => {
              await channel.current.removeMembers([userId]);
              navigation.pop(2);
            }}
            outlineContainer={styles.button}
          />
        ) : null}
      </View>
    </View>
  );
};

export default ChannelInfo;

const styles = StyleSheet.create({
  header: {
    borderColor: WHITE12,
    borderBottomWidth: 1,
  },
  membersText: {
    ...Body1Bold,
    color: WHITE,
    textAlign: 'left',
    paddingLeft: 15,
  },
  headerTitleContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    ...Body1,
    color: WHITE,
    textAlign: 'center',
    marginRight: 25,
  },
  participants: {
    height: 50,
    width: '100%',
    padding: 15,
    ...Body1Bold,
    color: WHITE,
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  conditionalSpacing: {
    height: 50,
    width: '100%',
  },
  participantsList: {
    height: '55%',
  },
  participantsSeparator: {
    borderBottomColor: '#545454',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
  },
  buttonsContainer: {
    height: '25%',
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    height: 55,
    marginTop: 15,
  },
});
