import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { BGDARK, WHITE, WHITE60 } from 'shared/src/colors';

import { Body1, Body2, Body3 } from '../../../theme/fonts';
import AvatarImg from '../../../assets/avatar.png';

const members = [
  {
    _id: '12311',
    firstName: 'Enrique Javier',
    lastName: ' Abeyta Ubillos',
    position: 'CEO',
    avatar: AvatarImg,
  },
  {
    _id: '123',
    firstName: 'Enrique Javier',
    lastName: ' Abeyta Ubillos',
    position: 'CEO',
    avatar: AvatarImg,
  },
  {
    _id: '123111',
    firstName: 'Enrique Javier',
    lastName: ' Abeyta Ubillos',
    position: 'Digital Acquisition Manager',
    avatar: AvatarImg,
  },
];

const Members: React.FC = () => {
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity>
        <View style={styles.member}>
          <Image
            source={item.avatar}
            resizeMode="contain"
            style={styles.avatar}
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
    backgroundColor: BGDARK,
    width: 155,
    height: 180,
    alignItems: 'center',
    paddingTop: 8,
    marginVertical: 16,
    marginRight: 8,
    borderRadius: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  name: {
    color: WHITE,
    ...Body2,
  },
  position: {
    ...Body3,
    color: WHITE60,
    marginTop: 8,
  },
});
