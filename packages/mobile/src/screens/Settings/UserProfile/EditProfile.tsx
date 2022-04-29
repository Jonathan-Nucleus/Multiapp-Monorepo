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

import PAppContainer from '../../../components/common/PAppContainer';
import PTextInput from '../../../components/common/PTextInput';
import { Body1Bold, Body2, Body4 } from '../../../theme/fonts';
import { PRIMARY, WHITE, WHITE12, WHITE60 } from 'shared/src/colors';
import MainHeader from '../../../components/main/Header';
import pStyles from '../../../theme/pStyles';
import { useUpdateUserProfile } from '../../../graphql/mutation/account';
import { showMessage } from '../../../services/utils';

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const EditProfile: React.FC<RouterProps> = ({ navigation, route }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedIn, setLinkedIn] = useState('');

  useEffect(() => {
    if (route.params?.user) {
      setFirstName(route.params?.user.firstName);
      setLastName(route.params?.user.lastName);
      setTagline(route.params?.user.tagline);
      setBio(route.params?.user.overview);
      setWebsite(route.params?.user.website);
      setTwitter(route.params?.user.twitter);
      setLinkedIn(route.params?.user.linkedIn);
    }
  }, [route.params]);

  const [updateUserProfile] = useUpdateUserProfile();

  const disabled = useMemo(() => {
    if (firstName && lastName) {
      return false;
    }
    return true;
  }, [firstName, lastName]);

  const handleUpdateProfile = async () => {
    Keyboard.dismiss();

    try {
      await updateUserProfile({
        variables: {
          profile: {
            _id: route.params?.user._id,
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
          textInputStyle={styles.bio}
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
