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

import { Body2, Body3, H6 } from '../../../theme/fonts';
import PGradientButton from '../../../components/common/PGradientButton';
import LinkedinSvg from 'shared/assets/images/linkedin.svg';
import TwitterSvg from 'shared/assets/images/twitter.svg';
import DotsThreeVerticalSvg from 'shared/assets/images/dotsThreeVertical.svg';
import FastImage from 'react-native-fast-image';

const CompanyProfile: FC = ({ company }) => {
  return (
    <>
      <FastImage
        style={styles.backgroundImg}
        source={{
          uri: company.background,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.content}>
        <View style={styles.companyDetail}>
          <FastImage
            style={styles.backgroundImg}
            source={{
              uri: company.avatar,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.row}>
            <View>
              <Text style={styles.val}>{company.followerIds?.length ?? 0}</Text>
              <Text style={styles.comment}>Followers</Text>
            </View>
            <View>
              <Text style={styles.val}>
                {company.followingIds?.length ?? 0}
              </Text>
              <Text style={styles.comment}>Following</Text>
            </View>
            <View>
              <Text style={styles.val}>{company.postIds?.length ?? 0}</Text>
              <Text style={styles.comment}>Posts</Text>
            </View>
          </View>
        </View>
        <Text style={styles.val}>{company.name}</Text>
        <Text style={styles.decription}>
          Virgin is a leading international investment group and one of the
          world's most recognised and respected brands. Read More...
        </Text>
        <PGradientButton label="follow" onPress={() => console.log(11)} />
      </View>
      <View style={[styles.row, styles.social]}>
        <TouchableOpacity onPress={() => Linking.openURL('www.twitter.com')}>
          <LinkedinSvg />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('www.twitter.com')}>
          <TwitterSvg />
        </TouchableOpacity>
        <View style={styles.verticalLine} />
        <TouchableOpacity onPress={() => Linking.openURL('www.twitter.com')}>
          <Text style={styles.website}>Website</Text>
        </TouchableOpacity>
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
  },
  content: {
    paddingHorizontal: 16,
    backgroundColor: BGHEADER,
    paddingBottom: 16,
  },
  companyDetail: {
    flexDirection: 'row',
    marginTop: -40,
    marginBottom: 16,
  },
  val: {
    color: WHITE,
    ...H6,
  },
  comment: {
    color: WHITE12,
    ...Body3,
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
});
