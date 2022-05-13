import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Avatar from 'mobile/src/components/common/Avatar';
import { WHITE, BLACK } from 'shared/src/colors';
import { Body1Bold, Body3 } from 'mobile/src/theme/fonts';

import { AVATAR_URL } from 'react-native-dotenv';
import PLabel from 'mobile/src/components/common/PLabel';
import PGradientButton from 'mobile/src/components/common/PGradientButton';

import { useAccount } from 'shared/graphql/query/account/useAccount';
import { useFollowUser } from 'shared/graphql/mutation/account';
import { FundManager } from 'shared/graphql/query/marketplace/useFundManagers';

interface FundUserInfoProps {
  manager: FundManager;
}

const FundUserInfo: React.FC<FundUserInfoProps> = ({ manager }) => {
  const { data: accountData } = useAccount();
  const [followUser] = useFollowUser();

  const isFollowingManager = !!accountData?.account?.followingIds?.includes(
    manager._id,
  );
  const [following, setFollowing] = useState(isFollowingManager);
  const toggleFollow = async (): Promise<void> => {
    if (!accountData) return;

    // Update state immediately for responsiveness
    setFollowing(!isFollowingManager);

    const result = await followUser({
      variables: {
        userId: manager._id,
        follow: !following,
      },
      refetchQueries: ['Account', 'FundManagers'],
    });

    if (!result.data?.followUser) {
      // Revert back to original state on error
      setFollowing(isFollowingManager);
    }
  };

  return (
    <View style={styles.userInfoContainer}>
      <Avatar size={48} user={manager} style={styles.managerAvatar} />
      <View style={styles.managerInfo}>
        <View>
          <PLabel
            textStyle={Body1Bold}
            label={`${manager.postIds?.length ?? 0}`}
          />
          <PLabel textStyle={Body3} viewStyle={styles.postView} label="Posts" />
        </View>
        <View>
          <PLabel
            textStyle={Body1Bold}
            label={`${manager.followerIds?.length ?? 0}`}
          />
          <PLabel
            textStyle={Body3}
            viewStyle={styles.postView}
            label="Followers"
          />
        </View>
        <PGradientButton
          label={following ? 'Unfollow' : 'Follow'}
          textStyle={styles.buttonText}
          btnContainer={styles.buttonContainer}
          onPress={toggleFollow}
        />
      </View>
    </View>
  );
};

export default FundUserInfo;

const styles = StyleSheet.create({
  userInfoContainer: {
    backgroundColor: BLACK,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  managerAvatar: {
    marginRight: 16,
  },
  managerInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postView: {
    marginTop: 8,
  },
  whiteText: {
    color: WHITE,
  },
  buttonContainer: {
    width: 120,
    height: 40,
  },
  buttonText: {
    textTransform: 'none',
    fontWeight: 'bold',
  },
});
