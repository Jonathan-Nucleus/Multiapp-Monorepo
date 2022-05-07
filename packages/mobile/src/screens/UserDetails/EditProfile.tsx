import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { CaretLeft, LinkedinLogo, TwitterLogo } from 'phosphor-react-native';

import MainHeader from 'mobile/src/components/main/Header';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PTextInput from 'mobile/src/components/common/PTextInput';
import { showMessage } from 'mobile/src/services/utils';
import { Body1Bold, Body2, Body4 } from 'mobile/src/theme/fonts';
import { PRIMARY, WHITE, WHITE12, WHITE60 } from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';

import { useAccount } from 'mobile/src/graphql/query/account';
import { useUpdateUserProfile } from 'mobile/src/graphql/mutation/account';

import { EditUserProfileScreen } from 'mobile/src/navigations/UserDetailsStack';

const EditProfile: EditUserProfileScreen = ({ navigation }) => {
  const { data: accountData } = useAccount();
  const [updateUserProfile] = useUpdateUserProfile();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedIn, setLinkedIn] = useState('');

  const user = accountData?.account;

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setTagline(user.tagline ?? '');
      setBio(user.overview ?? '');
      setWebsite(user.website ?? '');
      setTwitter(user.twitter ?? '');
      setLinkedIn(user.linkedIn ?? '');
    }
  }, [user]);

  const disabled = useMemo(() => {
    if (firstName && lastName) {
      return false;
    }
    return true;
  }, [firstName, lastName]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    Keyboard.dismiss();

    try {
      await updateUserProfile({
        variables: {
          profile: {
            _id: user._id,
            firstName,
            lastName,
            tagline,
            overview: bio,
            website: website ?? '',
            linkedIn: linkedIn ?? '',
            twitter: twitter ?? '',
          },
        },
        refetchQueries: ['Account'],
      });
      showMessage('success', 'Profile is updated.');
      navigation.goBack();
    } catch (e: any) {
      console.log(e.message);
      showMessage('error', e.message);
    }
  };

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader
        leftIcon={<CaretLeft color={WHITE} />}
        centerIcon={<Text style={styles.header}>Edit Profile</Text>}
        rightIcon={
          <TouchableOpacity onPress={handleUpdateProfile} disabled={disabled}>
            <Text style={[styles.save, !disabled && styles.active]}>Save</Text>
          </TouchableOpacity>
        }
        onPressLeft={() => navigation.goBack()}
        containerStyle={styles.headerContainer}
      />
      <PAppContainer>
        <PTextInput
          label="First name"
          onChangeText={(val: string) => setFirstName(val)}
          text={firstName}
          containerStyle={styles.textContainer}
        />
        <PTextInput
          label="Last name"
          onChangeText={(val: string) => setLastName(val)}
          text={lastName}
        />
        <PTextInput
          label="Tagline"
          onChangeText={(val: string) => setTagline(val)}
          text={tagline}
        />
        <PTextInput
          label="Bio"
          onChangeText={(val: string) => setBio(val)}
          text={bio}
          multiline
          textInputStyle={styles.bioText}
          textContainerStyle={styles.bio}
        />
        <Text style={styles.social}>Social / Website Links</Text>
        <View style={styles.row}>
          <PTextInput
            label=""
            onChangeText={(val: string) => setLinkedIn(val)}
            text={linkedIn}
            textInputStyle={styles.socialView}
          />
          <View style={styles.icon}>
            <LinkedinLogo size={24} weight="fill" color={WHITE} />
          </View>
        </View>
        <View style={styles.row}>
          <PTextInput
            label=""
            onChangeText={(val: string) => setTwitter(val)}
            text={twitter}
            textInputStyle={styles.socialView}
          />
          <View style={styles.icon}>
            <TwitterLogo size={24} weight="fill" color={WHITE} />
          </View>
        </View>
        <PTextInput
          label="Website"
          onChangeText={(val: string) => setWebsite(val)}
          text={website}
        />
      </PAppContainer>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    ...Body1Bold,
    color: WHITE,
  },
  save: {
    color: WHITE60,
    ...Body2,
  },
  active: {
    color: PRIMARY,
  },
  textContainer: {
    marginTop: 20,
  },
  row: {
    position: 'relative',
  },
  social: {
    marginVertical: 12,
    color: WHITE,
    ...Body4,
  },
  socialView: {
    paddingLeft: 60,
  },
  bio: {
    height: 180,
  },
  bioText: {
    height: '100%',
  },
  icon: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    borderRightColor: WHITE12,
    borderRightWidth: 1,
  },
});
