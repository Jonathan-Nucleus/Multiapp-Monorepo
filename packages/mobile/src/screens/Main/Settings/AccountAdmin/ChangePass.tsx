import React, { useState } from 'react';
import { StyleSheet, Keyboard, View, Text } from 'react-native';
import { CaretLeft } from 'phosphor-react-native';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PTextInput from 'mobile/src/components/common/PTextInput';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import ErrorText from 'mobile/src/components/common/ErrorTxt';
import { PRIMARY, WHITE, WHITE12, BGHEADER } from 'shared/src/colors';
import { Body1, Body2 } from 'mobile/src/theme/fonts';
import { showMessage } from 'mobile/src/services/ToastService';
import pStyles from 'mobile/src/theme/pStyles';

import MainHeader from 'mobile/src/components/main/Header';
import CheckCircleSvg from 'mobile/src/assets/icons/CheckCircle.svg';
import CircleSvg from 'mobile/src/assets/icons/Circle.svg';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  SubmitHandler,
  useForm,
  Controller,
  DefaultValues,
} from 'react-hook-form';

import { setToken } from 'mobile/src/utils/auth-token';
import { PASSWORD_PATTERN, passwordRequirements } from 'shared/src/patterns';
import { useUpdatePassword } from 'shared/graphql/mutation/account/useUpdatePassword';
import type { ChangePassScreen } from 'mobile/src/navigations/MoreStack';

type FormValues = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

const schema = yup
  .object({
    oldPassword: yup.string().required('Required').default(''),
    password: yup
      .string()
      .matches(
        PASSWORD_PATTERN,
        "Oops, your password doesn't meet the requirements below",
      )
      .required('Required')
      .default(''),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Confirm password mismatch')
      .required('Required')
      .default(''),
  })
  .required();

const ChangePass: ChangePassScreen = ({ navigation }) => {
  const [secureOldPassEntry, setSecureOldPassEntry] = useState(true);
  const [securePassEntry, setSecurePassEntry] = useState(true);
  const [secureConfirmPassEntry, setSecureConfirmPassEntry] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [updatePassword] = useUpdatePassword();
  const {
    handleSubmit,
    formState: { isValid },
    control,
    watch,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: schema.cast(
      {},
      { assert: false, stripUnknown: true },
    ) as DefaultValues<FormValues>,
  });

  const password = watch('password');
  const passesRequirements = passwordRequirements.map(({ label, pattern }) => ({
    label,
    met: !!password.match(pattern),
  }));

  const onSubmit: SubmitHandler<FormValues> = async ({
    oldPassword,
    password: confirmedPassword,
  }): Promise<void> => {
    Keyboard.dismiss();
    setLoading(true);

    try {
      const { data } = await updatePassword({
        variables: {
          oldPassword,
          newPassword: confirmedPassword,
        },
      });

      if (data?.updatePassword) {
        showMessage('success', 'Password successfully updated');
        await setToken(data.updatePassword);
        navigation.goBack();
      }
    } catch (err) {
      console.log('error', err);
      setError('Incorrect password');
    }

    setLoading(false);
  };

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader
        leftIcon={
          <View style={styles.row}>
            <CaretLeft size={28} color={WHITE} />
            <Text style={styles.headerTitle}>Change Password</Text>
          </View>
        }
        onPressLeft={() => navigation.goBack()}
      />
      <PAppContainer style={styles.content}>
        {!!error && <ErrorText error={error} />}
        <Controller
          control={control}
          name="oldPassword"
          render={({ field, fieldState }) => (
            <PTextInput
              label="Old Password"
              subLabel={secureOldPassEntry ? 'Show' : 'Hide'}
              secureTextEntry={secureOldPassEntry}
              onChangeText={field.onChange}
              text={field.value}
              onPressText={() => setSecureOldPassEntry(!secureOldPassEntry)}
              subLabelTextStyle={styles.subLabelText}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <PTextInput
              label="Password"
              subLabel={securePassEntry ? 'Show' : 'Hide'}
              secureTextEntry={securePassEntry}
              onChangeText={field.onChange}
              text={field.value}
              onPressText={() => setSecurePassEntry(!securePassEntry)}
              subLabelTextStyle={styles.subLabelText}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <>
              <PTextInput
                label="Confirm Password"
                subLabel={secureConfirmPassEntry ? 'Show' : 'Hide'}
                secureTextEntry={secureConfirmPassEntry}
                onChangeText={field.onChange}
                text={field.value}
                onPressText={() =>
                  setSecureConfirmPassEntry(!secureConfirmPassEntry)
                }
                subLabelTextStyle={styles.subLabelText}
                error={fieldState.error?.message}
              />
              <View style={styles.info}>
                {passesRequirements.map(({ label, met }) => (
                  <View key={label} style={styles.validationItem}>
                    {met ? <CheckCircleSvg /> : <CircleSvg />}
                    <Text style={styles.infoTxt}>{label}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        />
        <PGradientButton
          label="change password"
          btnContainer={styles.btnContainer}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
          disabled={!isValid}
        />
      </PAppContainer>
    </View>
  );
};

export default ChangePass;

const styles = StyleSheet.create({
  headerTitle: {
    ...Body1,
    color: WHITE,
  },
  content: {
    marginTop: 28,
  },
  info: {
    padding: 16,
    borderRadius: 4,
    borderColor: WHITE12,
    borderWidth: 1,
    backgroundColor: BGHEADER,
  },
  infoTxt: {
    color: WHITE,
    ...Body2,
    marginLeft: 9,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subLabelText: {
    color: PRIMARY,
  },
  btnContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
