import React, { FC } from 'react';
import {
  ListRenderItem,
  Dimensions,
  View,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import Avatar from 'mobile/src/components/common/Avatar';
import PLabel from 'mobile/src/components/common/PLabel';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import pStyles from 'mobile/src/theme/pStyles';
import { Body1Bold, Body2Bold, Body3 } from 'mobile/src/theme/fonts';
import { WHITE12, WHITE60 } from 'shared/src/colors';

import type { TeamMember } from 'shared/graphql/query/marketplace/useFund';

interface TeamListProps {
  team: TeamMember[];
}

const TeamList: React.FC<TeamListProps> = ({ team }) => {
  if (team.length === 0) {
    return null;
  }

  const renderTeamMemberItem: ListRenderItem<TeamMember> = ({ item }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.memberItemContainer,
          team.length === 1 ? styles.fullWidth : null,
          pressed ? pStyles.pressedStyle : null,
        ]}
        onPress={() =>
          NavigationService.navigate('UserDetails', {
            screen: 'UserProfile',
            params: {
              userId: item._id,
            },
          })
        }>
        <View
          style={[styles.memberItem, team.length === 1 && styles.fullWidth]}>
          <Avatar user={item} size={80} style={styles.avatar} />
          <PLabel
            textStyle={styles.name}
            label={`${item.firstName} ${item.lastName}`}
          />
          <PLabel textStyle={styles.position} label={item.position || ''} />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.memberContainer}>
      <PLabel label="Team Members" textStyle={styles.sectionTitle} />
      <FlatList
        data={team}
        keyExtractor={(item) => item._id}
        renderItem={renderTeamMemberItem}
        showsVerticalScrollIndicator={false}
        horizontal={true}
      />
    </View>
  );
};

export default TeamList;

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 16,
    ...Body1Bold,
  },
  memberContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  memberItemContainer: {
    width: Dimensions.get('screen').width / 2 - 20,
    borderColor: WHITE12,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
    marginVertical: 16,
  },
  memberItem: {
    alignItems: 'center',
    padding: 16,
    alignSelf: 'center',
  },
  fullWidth: {
    width: Dimensions.get('screen').width - 32,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    ...Body2Bold,
    textTransform: 'capitalize',
  },
  position: {
    ...Body3,
    color: WHITE60,
    marginTop: 8,
    textAlign: 'center',
  },
});
