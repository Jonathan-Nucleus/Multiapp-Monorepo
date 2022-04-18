import React from 'react';
import { StyleSheet, View } from 'react-native';
import RoundImageView from 'mobile/src/components/common/RoundImageView';
import { WHITE, BLACK } from 'shared/src/colors';
import { Body1Bold, Body3 } from 'mobile/src/theme/fonts';

import { AVATAR_URL } from 'react-native-dotenv';
import PLabel from '../../../components/common/PLabel';
import PGradientButton from '../../../components/common/PGradientButton';

interface FundCompanyInfoProps {
  item: any;
}

const FundCompanyInfo: React.FC<FundCompanyInfoProps> = ({ item }) => {
  return (
    <View style={styles.userInfoContainer}>
      <RoundImageView
        size={48}
        image={{ uri: `${AVATAR_URL}/${item.avatar}` }}
        imageStyle={styles.managerAvatar}
      />
      <View style={styles.managerInfo}>
        <View>
          <PLabel
            textStyle={Body1Bold}
            label={`${item.postIds?.length ?? 0}`}
          />
          <PLabel textStyle={Body3} viewStyle={styles.postView} label="Posts" />
        </View>
        <View>
          <PLabel
            textStyle={Body1Bold}
            label={`${item.followerIds?.length ?? 0}`}
          />
          <PLabel
            textStyle={Body3}
            viewStyle={styles.postView}
            label="Followers"
          />
        </View>
        <PGradientButton
          label="Follow"
          textStyle={styles.buttonText}
          btnContainer={styles.buttonContainer}
          onPress={() => console.log(111)}
        />
      </View>
    </View>
  );
};

export default FundCompanyInfo;

const styles = StyleSheet.create({
  userInfoContainer: {
    backgroundColor: BLACK,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  managerAvatar: {
    marginRight: 16,
    borderRadius: 8,
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
