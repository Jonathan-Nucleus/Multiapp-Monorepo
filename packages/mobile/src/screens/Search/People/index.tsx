import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { ShieldCheck } from 'phosphor-react-native';

import { WHITE, WHITE60 } from 'shared/src/colors';
import { Body2Bold, Body3 } from '../../../theme/fonts';
import { User } from 'backend/graphql/users.graphql';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import Avatar from 'mobile/src/components/common/Avatar';
import pStyles from '../../../theme/pStyles';

interface PeopleProps {
  users: User[];
  search: string;
}

const People: React.FC<PeopleProps> = ({ users, search }: PeopleProps) => {
  const renderItem: ListRenderItem<User> = ({ item }) => {
    const isPro = item?.role === 'PROFESSIONAL';
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
        <View style={[styles.row, styles.item]}>
          <Avatar user={item} style={styles.avatar} size={48} />
          <View style={styles.rightItem}>
            <View>
              <Text style={styles.name}>
                {item.firstName} {item.lastName}
              </Text>
              {isPro && (
                <View style={styles.proWrapper}>
                  <ShieldCheck />
                  <Text style={styles.name}>PRO</Text>
                </View>
              )}
            </View>
            <View style={[styles.row, styles.wrap]}>
              <Text style={styles.name}>{item.company?.name}</Text>
              <Text style={styles.position}>{item.position}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={pStyles.globalContainer}>
      {!!search && (
        <Text style={styles.alert}>
          {users.length} people results for "{search}" in People
        </Text>
      )}
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        style={styles.flatList}
      />
    </View>
  );
};

export default People;

const styles = StyleSheet.create({
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
  proWrapper: {
    flexDirection: 'row',
    marginLeft: 8,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  wrap: {
    flexWrap: 'wrap',
  },
  rightItem: {
    flex: 1,
    marginLeft: 10,
  },
  item: {
    paddingHorizontal: 16,
  },
  flatList: {
    marginTop: 28,
  },
  alert: {
    color: WHITE60,
    marginTop: 18,
    paddingHorizontal: 16,
  },
});
