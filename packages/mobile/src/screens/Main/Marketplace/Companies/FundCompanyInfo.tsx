import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Avatar from 'mobile/src/components/common/Avatar';
import { WHITE, BLACK } from 'shared/src/colors';
import { Body1Bold, Body3 } from 'mobile/src/theme/fonts';

import PLabel from 'mobile/src/components/common/PLabel';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

import { Company } from 'shared/graphql/query/marketplace/useFundCompanies';
import { useFollowCompany } from 'shared/graphql/mutation/account/useFollowCompany';

interface FundCompanyInfoProps {
  company: Company;
}

const FundCompanyInfo: React.FC<FundCompanyInfoProps> = ({ company }) => {
  const { isFollowing, toggleFollow } = useFollowCompany(company._id);

  return (
    <TouchableOpacity
      onPress={() => {
        NavigationService.navigate('CompanyDetails', {
          screen: 'CompanyProfile',
          params: {
            companyId: company._id,
          },
        });
      }}>
      <View style={styles.userInfoContainer}>
        <Avatar
          size={48}
          user={{
            avatar: company.avatar,
            firstName: company.name,
            lastName: '',
          }}
          style={styles.managerAvatar}
        />
        <View style={styles.managerInfo}>
          <View>
            <PLabel
              textStyle={Body1Bold}
              label={`${company.postIds?.length ?? 0}`}
            />
            <PLabel
              textStyle={Body3}
              viewStyle={styles.postView}
              label="Posts"
            />
          </View>
          <View>
            <PLabel
              textStyle={Body1Bold}
              label={`${company.followerIds?.length ?? 0}`}
            />
            <PLabel
              textStyle={Body3}
              viewStyle={styles.postView}
              label="Followers"
            />
          </View>
          <PGradientButton
            label={isFollowing ? 'Unfollow' : 'Follow'}
            textStyle={styles.buttonText}
            btnContainer={styles.buttonContainer}
            onPress={toggleFollow}
          />
        </View>
      </View>
    </TouchableOpacity>
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
