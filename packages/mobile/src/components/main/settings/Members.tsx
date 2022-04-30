import React from 'react';
import {
  ListRenderItem,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import Avatar from 'mobile/src/components/common/Avatar';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import { BGDARK, WHITE, WHITE60 } from 'shared/src/colors';
import { Body1, Body2Bold, Body3 } from '../../../theme/fonts';

import { CompanyMember } from '../../../graphql/query/company';

interface MemberProps {
  members: CompanyMember[];
}

const Members: React.FC<MemberProps> = ({ members }) => {
  const renderItem: ListRenderItem<CompanyMember> = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          NavigationService.navigate('UserDetails', {
            screen: 'UserProfile',
            params: {
              userId: item._id,
            },
          })
        }>
        <View style={[styles.member, members.length === 1 && styles.fullWidth]}>
          <Avatar user={item} style={styles.avatar} size={80} />
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
  fullWidth: {
    width: Dimensions.get('screen').width - 32,
  },
  avatar: {
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
