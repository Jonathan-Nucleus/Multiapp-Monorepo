import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import Avatar from 'mobile/src/components/common/Avatar';
import { Invitee, User } from 'shared/graphql/query/account/useInvites';

import { BGDARK300 } from 'shared/src/colors';

interface InvitationCoinProp {
  user?: Invitee;
}

const InvitationCoin: FC<InvitationCoinProp> = ({ user }) => {
  const isRegistered = 'firstName' in (user ?? {});
  return !user ? (
    <View style={styles.empty} />
  ) : isRegistered ? (
    <Avatar user={user as User} size={48} />
  ) : (
    <Avatar user={{ _id: '', name: user.email }} size={48} />
  );
};

export default InvitationCoin;

const styles = StyleSheet.create({
  empty: {
    backgroundColor: BGDARK300,
    width: 48,
    aspectRatio: 1,
    borderRadius: 24,
  },
});
