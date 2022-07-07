import React, { useState, Fragment, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  SubmitHandler,
  useForm,
  Controller,
  DefaultValues,
  SubmitErrorHandler,
} from 'react-hook-form';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTextInput from '../../components/common/PTextInput';
import PGradientButton from '../../components/common/PGradientButton';
import { Body2 } from '../../theme/fonts';
import { PRIMARY, WHITE, WHITE12 } from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';
// import AppleSvg from '../../assets/icons/apple.svg';
// import GoogleSvg from '../../assets/icons/google.svg';
// import LinkedinSvg from '../../assets/icons/linkedin.svg';
import CheckCircleSvg from '../../assets/icons/CheckCircle.svg';
import CircleSvg from '../../assets/icons/Circle.svg';
import ErrorSvg from '../../assets/icons/error.svg';

import type { SignupScreen } from 'mobile/src/navigations/AuthStack';

import { PASSWORD_PATTERN, passwordRequirements } from 'shared/src/patterns';
import PBackgroundImage from '../../components/common/PBackgroundImage';
import { showMessage } from '../../services/ToastService';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  oAuth: string;
};

const schema = yup
  .object({
    firstName: yup.string().required('Required').default(''),
    lastName: yup.string().required('Required').default(''),
    email: yup
      .string()
      .email('Invalid email address')
      .required('Required')
      .default(''),
    password: yup
      .string()
      .when('oAuth', {
        is: '',
        then: yup
          .string()
          .matches(PASSWORD_PATTERN, 'Invalid password')
          .required('Required'),
      })
      .default(''),
    oAuth: yup.string().default(''),
  })
  .required();

const Signup: SignupScreen = ({ navigation, route }) => {
  const [securePassEntry, setSecurePassEntry] = useState(true);
  const [error, setError] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
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
  const oAuthProvider = watch('oAuth');
  const passesRequirements = passwordRequirements.map(({ label, pattern }) => ({
    label,
    met: !!password.match(pattern),
  }));

  const onSubmit: SubmitHandler<FormValues> = async ({
    email,
    password,
    firstName,
    lastName,
  }) => {
    setError(false);
    navigation.navigate('Terms', {
      email,
      firstName,
      lastName,
      password,
      inviteCode: route.params.code,
    });
  };

  const errorMessage = (): string => {
    const { email, firstName, lastName, password } = errors;
    if (
      email?.message &&
      firstName?.message &&
      lastName?.message &&
      password?.message
    ) {
      return 'Invalid email address, first name, last name, and password';
    } else if (email?.message && firstName?.message && lastName?.message) {
      return 'Invalid email address, first name and last name.';
    } else if (email?.message && firstName?.message && password?.message) {
      return 'Invalid email address, first name and password.';
    } else if (email?.message && lastName?.message && password?.message) {
      return 'Invalid email address, last name and password.';
    } else if (email?.message && firstName?.message) {
      return 'Invalid email address and first name.';
    } else if (email?.message && lastName?.message) {
      return 'Invalid email address and last name.';
    } else if (email?.message && password?.message) {
      return 'Invalid email address and password.';
    } else if (email?.message) {
      return 'Invalid email address.';
    } else if (firstName?.message && lastName?.message && password?.message) {
      return 'Invalid first name, last name and password.';
    } else if (firstName?.message && password?.message) {
      return 'Invalid first name and password.';
    } else if (firstName?.message) {
      return 'Invalid first name.';
    } else if (lastName?.message && password?.message) {
      return 'Invalid last name and password.';
    } else if (lastName?.message) {
      return 'Invalid last name.';
    } else if (password?.message) {
      return 'Invalid password.';
    }

    return 'Invalid email address, first name, last name, and password.';
  };

  const onSubmitInvalid: SubmitErrorHandler<FormValues> = async () => {
    setError(true);
    showMessage('error', errorMessage());
  };

  const renderItem = useCallback(
    (text: string, validation: boolean): React.ReactElement => {
      return (
        <View style={styles.renderItem}>
          {validation ? (
            <CheckCircleSvg />
          ) : error ? (
            <ErrorSvg />
          ) : (
            <CircleSvg />
          )}
          <Text style={styles.infoTxt}>{text}</Text>
        </View>
      );
    },
    [error],
  );

  /*const handleRegisterOAuth = async (provider: string): Promise<void> => {
    setValue('oAuth', provider);
    handleSubmit(onSubmit)();
  };*/

  return (
    <PBackgroundImage>
      <SafeAreaView style={styles.container}>
        <PAppContainer style={styles.content}>
          <PHeader
            centerIcon={<LogoSvg />}
            outerContainerStyle={styles.header}
          />
          <View>
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <PTextInput
                  label="Email"
                  onChangeText={(text: string) => {
                    setError(false);
                    field.onChange(text);
                  }}
                  text={field.value}
                  keyboardType="email-address"
                  error={error ? fieldState.error?.message : undefined}
                  showError={false}
                />
              )}
            />
            <View style={styles.nameContainer}>
              <View style={styles.container}>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <PTextInput
                      label="First name"
                      onChangeText={(text: string) => {
                        setError(false);
                        field.onChange(text);
                      }}
                      text={field.value}
                      autoCapitalize="words"
                      autoCorrect={false}
                      error={error ? fieldState.error?.message : undefined}
                      showError={false}
                    />
                  )}
                />
              </View>
              <View style={styles.lastNameContainer}>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <PTextInput
                      label="Last name"
                      onChangeText={(text: string) => {
                        setError(false);
                        field.onChange(text);
                      }}
                      text={field.value}
                      autoCapitalize="words"
                      autoCorrect={false}
                      error={error ? fieldState.error?.message : undefined}
                      showError={false}
                    />
                  )}
                />
              </View>
            </View>
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <>
                  <PTextInput
                    label="Password"
                    subLabel={securePassEntry ? 'Show' : 'Hide'}
                    secureTextEntry={securePassEntry}
                    onChangeText={(text: string) => {
                      setError(false);
                      field.onChange(text);
                    }}
                    text={field.value}
                    textContainerStyle={styles.textContainer}
                    onPressText={() => setSecurePassEntry(!securePassEntry)}
                    subLabelTextStyle={styles.subLabelText}
                    error={error ? fieldState.error?.message : undefined}
                    showError={false}
                    icon={
                      field.value === '' ? null : passesRequirements.filter(
                          ({ met }) => met === true,
                        ).length === 4 ? (
                        <CheckCircleSvg />
                      ) : (
                        <ErrorSvg />
                      )
                    }
                  />
                  <View style={styles.info}>
                    {passesRequirements.map(({ label, met }) => (
                      <Fragment key={label}>{renderItem(label, met)}</Fragment>
                    ))}
                  </View>
                </>
              )}
            />
            <PGradientButton
              label={'Next'}
              btnContainer={styles.btnContainer}
              onPress={handleSubmit(onSubmit, onSubmitInvalid)}
            />
          </View>
        </PAppContainer>
      </SafeAreaView>
    </PBackgroundImage>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: 'transparent',
  },
  header: {
    paddingBottom: 48,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastNameContainer: {
    flex: 1,
    marginLeft: 12,
  },
  btnContainer: {
    marginVertical: 24,
  },
  subLabelText: {
    color: PRIMARY,
  },
  info: {
    padding: 19,
    paddingBottom: 11,
    borderRadius: 16,
    borderColor: WHITE12,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  infoTxt: {
    color: WHITE,
    ...Body2,
    marginLeft: 9,
  },
  renderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
});
