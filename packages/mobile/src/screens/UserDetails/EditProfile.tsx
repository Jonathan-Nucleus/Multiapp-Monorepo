import React from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaretLeft, LinkedinLogo, TwitterLogo } from 'phosphor-react-native';
import _omitBy from 'lodash/omitBy';
import _isNil from 'lodash/isNil';

import { useForm, DefaultValues, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import MainHeader from 'mobile/src/components/main/Header';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PTextInput from 'mobile/src/components/common/PTextInput';
import { showMessage } from 'mobile/src/services/utils';
import { Body1Bold, Body2, Body4 } from 'mobile/src/theme/fonts';
import { PRIMARY, WHITE, WHITE12, WHITE60 } from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';

import { useAccountContext } from 'shared/context/Account';
import { useUpdateUserProfile } from 'shared/graphql/mutation/account';

import { EditUserProfileScreen } from 'mobile/src/navigations/UserDetailsStack';

type FormValues = {
  firstName: string;
  lastName: string;
  tagline?: string | null;
  overview?: string | null;
  website?: string | null;
  twitter?: string | null;
  linkedIn?: string | null;
};

const schema = yup
  .object({
    firstName: yup.string().trim().required('Required').default(''),
    lastName: yup.string().trim().required('Required').default(''),
    tagline: yup.string().nullable(),
    overview: yup.string().nullable(),
    website: yup.string().url('Invalid URL').nullable(),
    twitter: yup.string().url('Invalid URL').nullable(),
    linkedIn: yup.string().url('Invalid URL').nullable(),
  })
  .required();

const EditProfile: EditUserProfileScreen = ({ navigation }) => {
  const user = useAccountContext();
  const [updateUserProfile] = useUpdateUserProfile();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: schema.cast(user, {
      assert: false,
      stripUnknown: true,
    }) as DefaultValues<FormValues>,
  });

  const isValid = Object.keys(errors).length === 0;
  const onSubmit = async (values: FormValues): Promise<void> => {
    Keyboard.dismiss();

    try {
      await updateUserProfile({
        variables: {
          profile: {
            _id: user._id,
            ..._omitBy(values, _isNil),
          },
        },
      });
      showMessage('success', 'User profile successfully updated.');
      navigation.goBack();
    } catch (e: any) {
      console.log(e.message);
      showMessage('error', e.message);
    }
  };

  return (
    <SafeAreaView style={pStyles.globalContainer} edges={['bottom']}>
      <MainHeader
        leftIcon={<CaretLeft color={WHITE} />}
        centerIcon={<Text style={styles.header}>Edit Profile</Text>}
        rightIcon={
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}>
            <Text style={[styles.save, isValid ? styles.active : null]}>
              Save
            </Text>
          </TouchableOpacity>
        }
        onPressLeft={() => navigation.goBack()}
        containerStyle={styles.headerContainer}
      />
      <PAppContainer>
        <Controller
          control={control}
          name="firstName"
          render={({ field, fieldState }) => (
            <PTextInput
              label="First name"
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              text={field.value ?? ''}
              containerStyle={styles.textContainer}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field, fieldState }) => (
            <PTextInput
              label="Last name"
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              text={field.value ?? ''}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="tagline"
          render={({ field, fieldState }) => (
            <PTextInput
              label="Tagline"
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              text={field.value ?? ''}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="overview"
          render={({ field, fieldState }) => (
            <PTextInput
              label="Bio"
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              text={field.value ?? ''}
              multiline
              textInputStyle={styles.bioText}
              textContainerStyle={styles.bio}
              error={fieldState.error?.message}
            />
          )}
        />
        <Text style={styles.social}>Social / Website Links</Text>
        <Controller
          control={control}
          name="linkedIn"
          render={({ field, fieldState }) => (
            <View style={styles.row}>
              <PTextInput
                label=""
                labelStyle={styles.noHeight}
                subLabelStyle={styles.noHeight}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                text={field.value ?? ''}
                textInputStyle={styles.socialView}
                error={fieldState.error?.message}
              />
              <View style={styles.icon}>
                <LinkedinLogo size={24} weight="fill" color={WHITE} />
              </View>
            </View>
          )}
        />
        <Controller
          control={control}
          name="twitter"
          render={({ field, fieldState }) => (
            <View style={styles.row}>
              <PTextInput
                label=""
                labelStyle={styles.noHeight}
                subLabelStyle={styles.noHeight}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                text={field.value ?? ''}
                textInputStyle={styles.socialView}
                error={fieldState.error?.message}
              />
              <View style={styles.icon}>
                <TwitterLogo size={24} weight="fill" color={WHITE} />
              </View>
            </View>
          )}
        />
        <Controller
          control={control}
          name="website"
          render={({ field, fieldState }) => (
            <PTextInput
              label="Website"
              placeholder="https://"
              onChangeText={field.onChange}
              onFocus={() => {
                if (!field.value || field.value === '') {
                  field.onChange('https://');
                }
              }}
              onBlur={(evt) => {
                if (evt.nativeEvent.text === 'https://') {
                  field.onChange('');
                }

                field.onBlur();
              }}
              text={field.value ?? ''}
              error={fieldState.error?.message}
            />
          )}
        />
      </PAppContainer>
    </SafeAreaView>
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
  noHeight: {
    height: 0,
  },
  icon: {
    position: 'absolute',
    top: 5,
    left: 0,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    borderRightColor: WHITE12,
    borderRightWidth: 1,
  },
});
