import React, { FC, Fragment, useRef, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import Avatar from 'mobile/src/components/common/Avatar';
import PLabel from 'mobile/src/components/common/PLabel';
import PText from 'mobile/src/components/common/PText';
import PMarkdown from 'mobile/src/components/common/PMarkdown';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import pStyles from 'mobile/src/theme/pStyles';
import {
  Body2Semibold,
  Body2Bold,
  Body3,
  Body4Medium,
} from 'mobile/src/theme/fonts';
import { PRIMARY, BLACK, WHITE60, WHITE12 } from 'shared/src/colors';

import type { TeamMember } from 'shared/graphql/query/marketplace/useFund';

interface TeamMemberProfileProps {
  member: TeamMember;
}

const DEFAULT_HEIGHT = 360;

const TeamMemberProfile: React.FC<TeamMemberProfileProps> = ({ member }) => {
  const fullHeight = useRef(0);
  const [isExpanded, setExpanded] = useState(false);

  const followers = member.followerIds?.length ?? 0;
  const posts = member.postIds?.length ?? 0;

  return (
    <View
      style={[
        styles.container,
        { height: isExpanded ? fullHeight.current : DEFAULT_HEIGHT },
      ]}>
      <View
        style={styles.content}
        onLayout={(event) => {
          fullHeight.current = event.nativeEvent.layout.height;
        }}>
        <Pressable
          style={({ pressed }) => [
            styles.profileSummary,
            pressed ? pStyles.pressedStyle : null,
          ]}
          onPress={() =>
            NavigationService.navigate('UserDetails', {
              screen: 'UserProfile',
              params: {
                userId: member._id,
              },
            })
          }>
          <Avatar user={member} size={96} />
          <View style={styles.profileSummaryDetails}>
            <PLabel
              textStyle={styles.name}
              label={`${member.firstName} ${member.lastName}`}
            />
            <PLabel
              textStyle={styles.profileText}
              label={member.position || ''}
            />
            <PLabel
              textStyle={styles.profileText}
              label={`${followers} ${
                followers === 1 ? 'Follower' : 'Followers'
              }  •  ${posts} ${posts === 1 ? 'Post' : 'Posts'}`}
            />
          </View>
        </Pressable>
        {member.profile?.map((section, index) => (
          <Fragment key={section.title}>
            <PText style={styles.sectionTitle}>{section.title}</PText>
            <PMarkdown>{section.desc}</PMarkdown>
            {index < (member.profile || []).length - 1 ? (
              <View style={styles.divider} />
            ) : null}
          </Fragment>
        ))}
      </View>
      <LinearGradient
        colors={['#00000000', isExpanded ? 'transparent' : BLACK]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
        style={styles.viewToggleContainer}>
        <Pressable
          onPress={() => setExpanded(!isExpanded)}
          style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}>
          <PText style={styles.more}>
            {isExpanded ? 'View less' : 'View more'}
          </PText>
        </Pressable>
      </LinearGradient>
    </View>
  );
};

export default TeamMemberProfile;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    marginBottom: 8,
  },
  content: {
    paddingBottom: 60,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: -12,
    color: WHITE60,
    textTransform: 'uppercase',
    letterSpacing: 1.25,
    ...Body4Medium,
  },
  profileSummary: {
    marginRight: 8,
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  profileSummaryDetails: {
    marginLeft: 16,
  },
  name: {
    ...Body2Bold,
    textTransform: 'capitalize',
  },
  profileText: {
    ...Body3,
    color: WHITE60,
    marginTop: 4,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: WHITE12,
    marginVertical: 8,
  },
  viewToggleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    paddingTop: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  more: {
    color: PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 1.25,
    ...Body2Semibold,
  },
});
