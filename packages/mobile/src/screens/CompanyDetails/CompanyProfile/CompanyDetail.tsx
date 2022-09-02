import React, { FC, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import { Chats, CopySimple, Pencil } from 'phosphor-react-native';

import Avatar from 'mobile/src/components/common/Avatar';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import PGradientOutlineButton from 'mobile/src/components/common/PGradientOutlineButton';
import LinkedinSvg from 'shared/assets/images/linkedin.svg';
import TwitterSvg from 'shared/assets/images/twitter.svg';
import FollowModal from 'mobile/src/components/main/FollowModal';
import {
  Body2,
  Body2Bold,
  Body3,
  H5Bold,
  H6Bold,
} from 'mobile/src/theme/fonts';
import {
  WHITE,
  WHITE12,
  GRAY100,
  PRIMARY,
  PRIMARYSOLID,
  BLACK,
  WHITE60,
} from 'shared/src/colors';

import { useFollowCompany } from 'shared/graphql/mutation/account/useFollowCompany';
import type { CompanyProfile } from 'shared/graphql/query/company/useCompany';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

import { S3_BUCKET } from 'react-native-dotenv';

interface CompanyDetailProps {
  company: CompanyProfile;
  isMyCompany?: boolean;
}

const CompanyDetail: FC<CompanyDetailProps> = ({ company, isMyCompany }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleFollow, setVisibleFollow] = useState(false);
  const { isFollowing, toggleFollow } = useFollowCompany(company._id);

  const {
    name,
    avatar,
    background,
    postCount,
    followerCount,
    followingCount,
    website,
    linkedIn,
    twitter,
  } = company;

  return (
    <>
      <View style={styles.relative}>
        {background?.url ? (
          <FastImage
            style={styles.backgroundImg}
            source={{
              uri: `${S3_BUCKET}/backgrounds/${company._id}/${background.url}`,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <PGradientButton
            btnContainer={styles.noBackground}
            gradientContainer={styles.gradientContainer}
          />
        )}
        {isMyCompany && (
          <TouchableOpacity
            onPress={() =>
              NavigationService.navigate('EditCompanyPhoto', {
                companyId: company._id,
                type: 'BACKGROUND',
              })
            }
            style={styles.pencil}>
            <Pencil color={WHITE} size={18} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.companyDetail}>
          <View style={styles.relative}>
            {avatar ? (
              <Avatar user={company} style={styles.avatar} size={80} />
            ) : (
              <View style={styles.noAvatarContainer}>
                <Text style={styles.noAvatar}>{name.charAt(0)}</Text>
              </View>
            )}
            {isMyCompany && (
              <TouchableOpacity
                onPress={() =>
                  NavigationService.navigate('EditCompanyPhoto', {
                    companyId: company._id,
                    type: 'AVATAR',
                  })
                }
                style={styles.pencil}>
                <Pencil color={WHITE} size={18} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => followerCount > 0 && setVisibleFollow(true)}>
            <View style={styles.follow}>
              <Text style={styles.val}>{followerCount}</Text>
              <Text style={styles.comment}>Followers</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => followingCount > 0 && setVisibleFollow(true)}>
            <View style={styles.follow}>
              <Text style={styles.val}>{followingCount}</Text>
              <Text style={styles.comment}>Following</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.follow}>
            <Text style={styles.val}>{postCount}</Text>
            <Text style={styles.comment}>Posts</Text>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          {company.overview ? (
            <Text style={styles.description}>{company.overview}</Text>
          ) : null}
        </View>
        {isMyCompany ? (
          <PGradientOutlineButton
            label="Edit Profile"
            onPress={() =>
              NavigationService.navigate('EditCompanyProfile', {
                companyId: company._id,
              })
            }
            containerStyle={styles.editButton}
          />
        ) : (
          <View style={styles.row}>
            {/**
               * Hide for MVP
              <PGradientOutlineButton
                label="Message"
                onPress={() => console.log(11)}
                gradientContainer={styles.button}
              />
              */}
            <PGradientButton
              label={isFollowing ? 'unfollow' : 'follow'}
              onPress={toggleFollow}
              gradientContainer={styles.button}
            />
          </View>
        )}
      </View>
      {!company.isChannel ? (
        <View style={[styles.row, styles.social]}>
          <View style={styles.socialView}>
            {linkedIn && linkedIn !== '' && (
              <TouchableOpacity onPress={() => Linking.openURL(linkedIn)}>
                <LinkedinSvg />
              </TouchableOpacity>
            )}
            {twitter && twitter !== '' && (
              <TouchableOpacity
                onPress={() => Linking.openURL(twitter)}
                style={styles.socialItem}>
                <TwitterSvg />
              </TouchableOpacity>
            )}
            {twitter !== '' ||
              (linkedIn !== '' && <View style={styles.verticalLine} />)}
            {website && website !== '' && (
              <>
                <TouchableOpacity onPress={() => Linking.openURL(website)}>
                  <Text style={styles.website} numberOfLines={1}>
                    {website}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          {/*
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <DotsThreeVerticalSvg />
        </TouchableOpacity>
        */}
        </View>
      ) : null}
      <Modal
        isVisible={isVisible}
        swipeDirection="down"
        onBackdropPress={() => setIsVisible(false)}
        style={styles.bottomHalfModal}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={() => {
              setIsVisible(false);
              NavigationService.navigate('Main', {
                screen: 'Chat',
              });
            }}>
            <View style={styles.item}>
              <Chats color={WHITE} size={28} />
              <View style={styles.commentWrap}>
                <Text style={styles.modalLabel}>Message {company.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsVisible(false)}>
            <View style={styles.item}>
              <CopySimple color={WHITE} size={28} />
              <View style={styles.commentWrap}>
                <Text style={styles.modalLabel}>Copy Link</Text>
              </View>
            </View>
          </TouchableOpacity>
          <PGradientOutlineButton
            label="Cancel"
            onPress={() => setIsVisible(false)}
            textStyle={styles.cancelBtnTxt}
          />
        </View>
      </Modal>
      <FollowModal
        onClose={() => setVisibleFollow(false)}
        following={company.following ?? []}
        followers={company.followers ?? []}
        isVisible={visibleFollow}
      />
    </>
  );
};

export default CompanyDetail;

const styles = StyleSheet.create({
  backgroundImg: {
    width: Dimensions.get('screen').width,
    height: 65,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flex: 1,
    marginTop: 16,
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
  name: {
    color: WHITE,
    marginTop: 8,
    ...H6Bold,
  },
  val: {
    color: WHITE,
    ...Body2Bold,
  },
  comment: {
    color: WHITE60,
    ...Body2,
    marginLeft: 8,
  },
  descriptionContainer: {
    marginVertical: 12,
  },
  description: {
    marginVertical: 8,
    color: WHITE,
    ...Body3,
  },
  social: {
    paddingVertical: 8,
    paddingLeft: 16,
    borderTopColor: WHITE12,
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: Dimensions.get('screen').width - 32,
    marginBottom: 0,
  },
  socialView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  socialItem: {
    marginHorizontal: 16,
  },
  bottomHalfModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: BLACK,
    paddingVertical: 37,
    paddingHorizontal: 28,
    borderRadius: 32,
  },
  commentWrap: {
    marginLeft: 15,
    flex: 1,
  },
  modalLabel: {
    color: WHITE,
    ...Body2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  relative: {
    position: 'relative',
  },
  noAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAvatar: {
    color: PRIMARYSOLID,
    ...H5Bold,
    textAlign: 'center',
  },
  noBackground: {
    height: 65,
  },
  gradientContainer: {
    borderRadius: 0,
    height: 65,
  },
  pencil: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: PRIMARYSOLID,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    borderRadius: 8,
  },
  editButton: {
    width: Dimensions.get('screen').width - 32,
    marginBottom: -8,
  },
  cancelBtnTxt: {
    textTransform: 'capitalize',
  },
});
