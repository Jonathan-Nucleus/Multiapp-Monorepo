import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { AVATAR_URL } from 'react-native-dotenv';
import { BGDARK, WHITE, WHITE60 } from 'shared/src/colors';
import type { User } from 'backend/graphql/users.graphql';

import { Body1, Body2Bold, Body3 } from '../../../theme/fonts';

interface MemberProps {
  members: User[];
}

interface RenderProps {
  item: User;
}

const Members: React.FC<MemberProps> = ({ members }) => {
  const renderItem = ({ item }: RenderProps) => {
    return (
      <TouchableOpacity>
        <View style={styles.member}>
          <FastImage
            style={styles.avatar}
            source={{
              uri: `${AVATAR_URL}/${item?.avatar}`,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text style={styles.name}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.position}>{item.position}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Team Members</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        horizontal={true}
      />
    </View>
  );
};

export default Members;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  text: {
    color: WHITE,
    ...Body1,
  },
  member: {
    borderColor: BGDARK,
    borderWidth: 1,
    width: Dimensions.get('screen').width / 2 - 20,
    height: 180,
    alignItems: 'center',
    padding: 8,
    marginVertical: 16,
    marginRight: 8,
    borderRadius: 8,
    alignSelf: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  name: {
    color: WHITE,
    ...Body2Bold,
  },
  position: {
    ...Body3,
    color: WHITE60,
    marginTop: 8,
    textAlign: 'center',
  },
});