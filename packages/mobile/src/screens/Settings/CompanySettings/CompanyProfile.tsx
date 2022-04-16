import React, { FC, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  WHITE,
  WHITE12,
  BLUE300,
  BGHEADER,
  GRAY100,
  PRIMARY,
} from 'shared/src/colors';
import { AVATAR_URL, BACKGROUND_URL } from 'react-native-dotenv';
import type { Company } from 'backend/graphql/companies.graphql';

import { Body2, Body3, H6Bold } from '../../../theme/fonts';
import PGradientButton from '../../../components/common/PGradientButton';
import PGradientOutlineButton from '../../../components/common/PGradientOutlineButton';
import LinkedinSvg from 'shared/assets/images/linkedin.svg';
import TwitterSvg from 'shared/assets/images/twitter.svg';
import DotsThreeVerticalSvg from 'shared/assets/images/dotsThreeVertical.svg';
import FastImage from 'react-native-fast-image';

interface CompanyProp {
  company: Company;
}
const CompanyProfile: FC<CompanyProp> = ({ company }) => {
  return (
    <>
      {company.background && (
        <FastImage
          style={styles.backgroundImg}
          source={{
            uri: `${BACKGROUND_URL}/${company.background}`,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}

      <View style={styles.content}>
        <View style={styles.companyDetail}>
          <FastImage
            style={styles.backgroundImg}
            source={{
              uri: `${AVATAR_URL}/${company?.avatar}`,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <Text style={styles.val}>{company.name}</Text>
        <View style={styles.row}>
          <View style={styles.follow}>
            <Text style={styles.val}>{company.followerIds?.length ?? 0}</Text>
            <Text style={styles.comment}>Followers</Text>
          </View>
          <View style={styles.follow}>
            <Text style={styles.val}>{company.followingIds?.length ?? 0}</Text>
            <Text style={styles.comment}>Following</Text>
          </View>
          <View style={styles.follow}>
            <Text style={styles.val}>{company.postIds?.length ?? 0}</Text>
            <Text style={styles.comment}>Posts</Text>
          </View>
        </View>
        <Text style={styles.decription}>
          Virgin is a leading international investment group and one of the
          world's most recognised and respected brands. Read More...
        </Text>
        <View style={styles.row}>
          <PGradientOutlineButton
            label="Message"
            onPress={() => console.log(11)}
            gradientContainer={styles.button}
          />
          <PGradientButton
            label="follow"
            onPress={() => console.log(11)}
            gradientContainer={styles.button}
          />
        </View>
      </View>
      <View style={[styles.row, styles.social]}>
        <TouchableOpacity onPress={() => Linking.openURL('www.twitter.com')}>
          <LinkedinSvg />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('www.twitter.com')}>
          <TwitterSvg />
        </TouchableOpacity>
        {company.website && (
          <>
            <View style={styles.verticalLine} />
            <TouchableOpacity onPress={() => Linking.openURL(company.website)}>
              <Text style={styles.website} numberOfLines={1}>
                {company.website}
              </Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity>
          <DotsThreeVerticalSvg />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CompanyProfile;

const styles = StyleSheet.create({
  backIcon: {
    backgroundColor: BLUE300,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 0,
  },
  backgroundImg: {
    width: Dimensions.get('screen').width,
    height: 65,
  },
  logo: {
    width: 80,
    height: 80,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flex: 1,
    marginTop: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  follow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyDetail: {
    flexDirection: 'row',
    marginTop: -40,
    marginBottom: 16,
  },
  val: {
    color: WHITE,
    ...H6Bold,
  },
  comment: {
    color: WHITE,
    ...Body3,
    marginLeft: 8,
  },
  decription: {
    marginVertical: 16,
    color: WHITE,
    ...Body3,
  },
  social: {
    paddingVertical: 8,
    borderTopColor: GRAY100,
    borderBottomColor: GRAY100,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginBottom: 24,
    backgroundColor: BGHEADER,
    alignItems: 'center',
  },
  verticalLine: {
    height: 32,
    backgroundColor: GRAY100,
    width: 1,
    marginLeft: 40,
    marginRight: 20,
  },
  website: {
    color: PRIMARY,
    ...Body3,
  },
  button: {
    width: Dimensions.get('screen').width / 2 - 24,
  },
});
