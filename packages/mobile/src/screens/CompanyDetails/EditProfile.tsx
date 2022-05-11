import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { CaretLeft, LinkedinLogo, TwitterLogo } from 'phosphor-react-native';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PTextInput from 'mobile/src/components/common/PTextInput';
import MainHeader from 'mobile/src/components/main/Header';
import { showMessage } from 'mobile/src/services/utils';
import { Body1Bold, Body2, Body4 } from 'mobile/src/theme/fonts';
import { PRIMARY, WHITE, WHITE12, WHITE60 } from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';

import { useCompany } from 'mobile/src/graphql/query/company/useCompany';
import { useUpdateCompanyProfile } from 'mobile/src/graphql/mutation/account';

import { EditCompanyPhotoScreen } from 'mobile/src/navigations/CompanyDetailsStack';

const EditCompanyProfile: EditCompanyPhotoScreen = ({ navigation, route }) => {
  const { companyId } = route.params;

  const { data: companyData } = useCompany(companyId);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedIn, setLinkedIn] = useState('');

  const company = companyData?.companyProfile;
  useEffect(() => {
    if (company) {
      setName(company.name);
      setBio(company.overview ?? '');
      setWebsite(company.website ?? '');
      setTwitter(company.twitter ?? '');
      setLinkedIn(company.linkedIn ?? '');
    }
  }, [company]);

  const [updateCompanyProfile] = useUpdateCompanyProfile();

  const disabled = useMemo(() => {
    return !name;
  }, [name]);

  const handleUpdateProfile = async () => {
    Keyboard.dismiss();

    try {
      await updateCompanyProfile({
        variables: {
          profile: {
            _id: companyId,
            name,
            overview: bio,
            website: website ?? '',
            linkedIn: linkedIn ?? '',
            twitter: twitter ?? '',
          },
        },
        refetchQueries: ['Account'],
      });
      showMessage('success', 'Company info is updated.');
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
        centerIcon={
          <Text style={styles.header} numberOfLines={1}>
            Edit Company Info
          </Text>
        }
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
          label="Company Name"
          onChangeText={(val: string) => setName(val)}
          text={name}
          containerStyle={styles.textContainer}
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

export default EditCompanyProfile;

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
