import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import PLabel from 'mobile/src/components/common/PLabel';
import { H6Bold } from 'mobile/src/theme/fonts';

import TeamMemberProfile from './TeamMemberProfile';
import type { TeamMember } from 'shared/graphql/query/marketplace/useFund';

interface DetailedTeamListProps {
  team: TeamMember[];
}

const DetailedTeamList: React.FC<DetailedTeamListProps> = ({ team }) => {
  if (team.length === 0) {
    return null;
  }
  return (
    <View style={styles.memberContainer}>
      <PLabel label="Leadership" textStyle={styles.sectionTitle} />
      {team.map((member) => (
        <TeamMemberProfile key={member._id} member={member} />
      ))}
    </View>
  );
};

export default DetailedTeamList;

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 8,
    lineHeight: 24,
    ...H6Bold,
  },
  memberContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
});
