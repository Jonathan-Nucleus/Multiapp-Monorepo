import React, { useState, Fragment } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CheckBox from '@react-native-community/checkbox';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  SubmitHandler,
  useForm,
  Controller,
  DefaultValues,
} from 'react-hook-form';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTitle from '../../components/common/PTitle';
import PTextInput from '../../components/common/PTextInput';
import PGradientButton from '../../components/common/PGradientButton';
import PTextLine from '../../components/common/PTextLine';
import ErrorText from '../../components/common/ErrorTxt';
import { Body2, Body2Bold, Body3 } from '../../theme/fonts';
import {
  BLACK,
  PRIMARY,
  WHITE,
  BLUE200,
  WHITE12,
  BGHEADER,
  DANGER,
} from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';
// import AppleSvg from '../../assets/icons/apple.svg';
// import GoogleSvg from '../../assets/icons/google.svg';
// import LinkedinSvg from '../../assets/icons/linkedin.svg';
import CheckCircleSvg from '../../assets/icons/CheckCircle.svg';
import CircleSvg from '../../assets/icons/Circle.svg';

import type { SignupScreen } from 'mobile/src/navigations/AuthStack';
import { setToken } from 'mobile/src/utils/auth-token';

import { PASSWORD_PATTERN, passwordRequirements } from 'shared/src/patterns';
import { useRegister } from 'shared/graphql/mutation/auth/useRegister';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  oAuth: string;
};

const schema = yup
  .object({
    firstName: yup.string().required('Required').default(''),
    lastName: yup.string().required('Required').default(''),
    email: yup
      .string()
      .email('Must be a valid email')
      .required('Required')
      .default(''),
    password: yup
      .string()
      .when('oAuth', {
        is: '',
        then: yup
          .string()
          .matches(
            PASSWORD_PATTERN,
            "Oops, your password doesn't meet the requirements below",
          )
          .required('Required'),
      })
      .default(''),
    confirmPassword: yup
      .string()
      .when('oAuth', {
        is: '',
        then: yup
          .string()
          .oneOf([yup.ref('password')], 'Confirm password mismatch')
          .required('Required'),
      })
      .default(''),
    acceptTerms: yup
      .boolean()
      .oneOf([true], 'You must accept the terms and conditions')
      .required()
      .default(false),
    oAuth: yup.string().default(''),
  })
  .required();

const Signup: SignupScreen = ({ navigation, route }) => {
  const [register] = useRegister();
  const [securePassEntry, setSecurePassEntry] = useState(true);
  const [secureConfirmPassEntry, setSecureConfirmPassEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const {
    handleSubmit,
    formState: { isValid },
    control,
    watch,
    setValue,
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
    firstName,
    lastName,
    email,
    password: confirmedPassword,
  }): Promise<void> => {
    Keyboard.dismiss();
    setLoading(true);

    try {
      const { data } = await register({
        variables: {
          user: {
            email,
            firstName,
            lastName,
            inviteCode: route.params.code,
            password: confirmedPassword,
          },
        },
      });

      console.log('Registration result', data);
      if (data?.register) {
        await setToken(data.register);
        navigation.navigate('Topic');
      }
    } catch (err) {
      console.log('error', err);
      setError(err instanceof Error ? err.message : 'Unexpected error');
    }

    setLoading(false);
  };

  const renderItem = (
    text: string,
    validation: boolean,
  ): React.ReactElement => {
    return (
      <View style={styles.renderItem}>
        {validation ? <CheckCircleSvg /> : <CircleSvg />}
        <Text style={styles.infoTxt}>{text}</Text>
      </View>
    );
  };

  /*const handleRegisterOAuth = async (provider: string): Promise<void> => {
    setValue('oAuth', provider);
    handleSubmit(onSubmit)();
  };*/

  return (
    <SafeAreaView style={styles.container}>
      <PAppContainer>
        <PHeader centerIcon={<LogoSvg />} />
        <PTitle
          title="You’re in!"
          subTitle="We need a few more details..."
          textStyle={styles.title}
        />
        {error ? <ErrorText error={error} /> : null}
        <Controller
          control={control}
          name="firstName"
          render={({ field, fieldState }) => (
            <PTextInput
              label="First name"
              onChangeText={field.onChange}
              text={field.value}
              containerStyle={styles.textContainer}
              autoCapitalize="words"
              autoCorrect={false}
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
              text={field.value}
              autoCapitalize="words"
              autoCorrect={false}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <PTextInput
              label="Email"
              onChangeText={field.onChange}
              text={field.value}
              keyboardType="email-address"
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
                  <Fragment key={label}>{renderItem(label, met)}</Fragment>
                ))}
              </View>
            </>
          )}
        />
        <Controller
          control={control}
          name="acceptTerms"
          render={({ field, fieldState }) => (
            <>
              <View style={styles.wrap}>
                <CheckBox
                  onValueChange={field.onChange}
                  value={field.value}
                  boxType="square"
                  onCheckColor={WHITE}
                  onFillColor={PRIMARY}
                  onTintColor={PRIMARY}
                  lineWidth={2}
                  style={styles.checkBox}
                />
                <View style={styles.checkBoxLabel}>
                  <Text style={styles.txt}>
                    I agree to the Prometheus Alts
                    <Text
                      onPress={() =>
                        Linking.openURL(
                          'https://prometheusalts.com/legals/disclosure-library',
                        )
                      }>
                      <Text style={styles.hyperText}> Terms</Text>
                    </Text>
                    <Text style={styles.txt}>, </Text>
                    <Text
                      onPress={() =>
                        Linking.openURL(
                          'https://prometheusalts.com/legals/disclosure-library',
                        )
                      }>
                      <Text style={styles.hyperText}> Community</Text>
                    </Text>
                    <Text style={styles.txt}> and </Text>
                    <Text
                      onPress={() =>
                        Linking.openURL(
                          'https://prometheusalts.com/legals/disclosure-library',
                        )
                      }>
                      <Text style={styles.hyperText}>Privacy Policy</Text>
                    </Text>
                    <Text style={styles.txt}>.</Text>
                  </Text>
                </View>
              </View>
              <Text style={styles.error}>
                {fieldState.error?.message ?? null}
              </Text>
            </>
          )}
        />

        <PGradientButton
          label="SIGN UP"
          btnContainer={styles.btnContainer}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid && oAuthProvider === ''}
          isLoading={loading}
        />
        {/**
          * Hide until these are configured 6/6/22
        <PTextLine title="OR, SIGN UP WITH" containerStyle={styles.bottom} />
        <View style={styles.row}>
          <TouchableOpacity style={styles.icon}>
            <LinkedinSvg />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => handleRegisterOAuth('apple')}>
            <AppleSvg />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => handleRegisterOAuth('google')}>
            <GoogleSvg />
          </TouchableOpacity>
        </View>
        */}
      </PAppContainer>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  title: {
    marginTop: 30,
    marginBottom: 4,
  },
  textContainer: {
    marginTop: 21,
  },
  textInput: {
    borderRadius: 16,
    height: 56,
    fontSize: 24,
    paddingHorizontal: 12,
  },
  btnContainer: {
    marginVertical: 20,
  },
  subLabelText: {
    color: PRIMARY,
  },
  wrap: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  txt: {
    ...Body2,
    color: WHITE,
    lineHeight: 18,
  },
  hyperText: {
    ...Body2,
    color: PRIMARY,
    lineHeight: 20,
  },
  bottom: {
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  icon: {
    borderWidth: 1,
    borderColor: BLUE200,
    borderRadius: 24,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  checkBox: {
    width: 20,
    height: 20,
  },
  checkBoxLabel: {
    flex: 1,
    marginLeft: 10,
  },
  label: {
    ...Body2Bold,
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
  renderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  error: {
    color: DANGER,
    ...Body3,
    marginBottom: 10,
    height: 12,
  },
});
