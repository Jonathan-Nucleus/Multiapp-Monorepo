import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { CaretLeft, LinkedinLogo, TwitterLogo } from 'phosphor-react-native';
import _omitBy from 'lodash/omitBy';
import _isNil from 'lodash/isNil';

import { useForm, DefaultValues, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PTextInput from 'mobile/src/components/common/PTextInput';
import MainHeader from 'mobile/src/components/main/Header';
import { showMessage } from 'mobile/src/services/utils';
import { Body1Bold, Body2, Body4 } from 'mobile/src/theme/fonts';
import { PRIMARY, WHITE, WHITE12, WHITE60 } from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';

import { useCompany } from 'shared/graphql/query/company/useCompany';
import { useUpdateCompanyProfile } from 'shared/graphql/mutation/account';

import { EditCompanyPhotoScreen } from 'mobile/src/navigations/CompanyDetailsStack';

type FormValues = {
  name: string;
  overview?: string | null;
  website?: string | null;
  twitter?: string | null;
  linkedIn?: string | null;
};

const schema = yup
  .object({
    name: yup.string().trim().required('Required').default(''),
    overview: yup.string().nullable(),
    website: yup.string().url('Invalid URL').nullable(),
    twitter: yup.string().url('Invalid URL').nullable(),
    linkedIn: yup.string().url('Invalid URL').nullable(),
  })
  .required();

const EditCompanyProfile: EditCompanyPhotoScreen = ({ navigation, route }) => {
  const { companyId } = route.params;

  const { data: companyData } = useCompany(companyId);
  const [updateCompanyProfile] = useUpdateCompanyProfile();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: schema.cast(
      {},
      {
        assert: false,
        stripUnknown: true,
      },
    ) as DefaultValues<FormValues>,
  });
  const isValid = Object.keys(errors).length === 0;

  const company = companyData?.companyProfile;
  useEffect(() => {
    if (company) {
      reset(
        _omitBy(
          schema.cast(company, {
            assert: false,
            stripUnknown: true,
          }),
          _isNil,
        ),
      );
    }
  }, [company]);

  const onSubmit = async ({ name, ...partialValues }: FormValues) => {
    Keyboard.dismiss();

    try {
      await updateCompanyProfile({
        variables: {
          profile: {
            _id: companyId,
            name,
            ..._omitBy(partialValues, _isNil),
          },
        },
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
          name="name"
          render={({ field, fieldState }) => (
            <PTextInput
              label="Company Name"
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
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                text={field.value ?? ''}
                textInputStyle={styles.socialView}
                labelStyle={styles.noHeight}
                subLabelStyle={styles.noHeight}
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
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                text={field.value ?? ''}
                labelStyle={styles.noHeight}
                subLabelStyle={styles.noHeight}
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
