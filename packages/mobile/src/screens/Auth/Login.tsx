import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@apollo/client';
import { CommonActions } from '@react-navigation/native';
import * as yup from 'yup';
import {
  Controller,
  DefaultValues,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { showMessage } from 'mobile/src/services/ToastService';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTextInput from '../../components/common/PTextInput';
import PGradientButton from '../../components/common/PGradientButton';
import { LOGIN } from 'shared/graphql/mutation/auth';
import { Body2 } from '../../theme/fonts';
import { PRIMARY, WHITE } from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';

import { setToken } from 'mobile/src/utils/auth-token';
import type { LoginScreen } from 'mobile/src/navigations/AuthStack';

import { authenticate } from 'mobile/src/services/auth/google-provider';
import { useLoginOAuth } from 'shared/graphql/mutation/auth/useLoginOAuth';
import CheckboxLabel from '../../components/common/CheckboxLabel';
import PBackgroundImage from '../../components/common/PBackgroundImage';

import { AF_CLICK_LOGIN, AFLogEvent } from '../../utils/AppsFlyerUtil';

type FormValues = {
  email: string;
  password: string;
};

const schema = yup
  .object({
    email: yup
      .string()
      .email('Invalid email address')
      .required('Invalid email address')
      .default(''),
    password: yup.string().required('Invalid password').default(''),
  })
  .required();

const Login: LoginScreen = ({ navigation }) => {
  const [checked, setChecked] = useState(true);
  const [securePassEntry, setSecurePassEntry] = useState(true);
  const [login] = useMutation(LOGIN);
  const [loginOAuth] = useLoginOAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleOption = (): void => {
    setChecked(!checked);
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: schema.cast(
      {},
      { assert: false, stripUnknown: true },
    ) as DefaultValues<FormValues>,
  });

  const saveAuthToken = async (
    token: string,
    persist: boolean,
  ): Promise<void> => {
    await setToken(token, persist);

    // Allow time for apollo client to reload with new auth token
    setTimeout(() => {
      setLoading(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Authenticated' }],
        }),
      );
    }, 500);
  };

  const onSubmit: SubmitHandler<FormValues> = async ({ email, password }) => {
    AFLogEvent(AF_CLICK_LOGIN, { email });
    Keyboard.dismiss();
    setLoading(true);
    setError(false);

    try {
      const { data } = await login({
        variables: {
          email,
          password,
        },
      });
      if (data.login) {
        saveAuthToken(data.login, checked);
        AsyncStorage.setItem('option', checked.toString());
        return;
      }
    } catch (e) {
      setError(true);
      showMessage('error', 'Invalid email address or password.');
      console.error('login error', e);
    }
    setLoading(false);
  };

  const onSubmitInvalid: SubmitErrorHandler<FormValues> = async () => {
    setError(true);
    const { email, password } = errors;
    if (email?.message && password?.message) {
      showMessage('error', 'Invalid email address and password.');
    } else if (email?.message) {
      showMessage('error', 'Invalid email address.');
    } else if (password?.message) {
      showMessage('error', 'Invalid password.');
    } else {
      showMessage('error', 'Invalid email address and password.');
    }
  };

  const googleLogin = async (): Promise<void> => {
    try {
      const result = await authenticate();
      if (result) {
        const { token, payload } = result;
        const { email, family_name, given_name } = payload;

        const { data } = await loginOAuth({
          variables: {
            user: {
              email,
              firstName: given_name,
              lastName: family_name,
              tokenId: token,
              provider: 'google',
            },
          },
        });

        if (data?.loginOAuth) {
          saveAuthToken(data.loginOAuth, checked);
        }
      } else {
        console.log('Something went wrong');
      }
    } catch (err) {
      console.log('google login err', err);
      showMessage(
        'error',
        'Linked accounts not supported. Try a different login method.',
      );
    }
  };

  const onPressResetPass = useCallback(() => {
    setError(false);
    navigation.navigate('ForgotPass');
  }, [navigation]);

  const linkedInLogin = async (): Promise<void> => {
    console.log('Logging in via linked in');
  };

  return (
    <PBackgroundImage>
      <SafeAreaView style={styles.container}>
        <PHeader centerIcon={<LogoSvg />} />
        <PAppContainer style={styles.content}>
          <View style={styles.wrap}>
            <Text style={styles.txt}>New here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Code')}>
              <Text style={styles.hyperText}>Sign up with a code</Text>
            </TouchableOpacity>
          </View>

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
                error={error ? fieldState.error?.message : ''}
                showError={false}
                autoCapitalize="none"
                autoCorrect={false}
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
                onChangeText={(text: string) => {
                  setError(false);
                  field.onChange(text);
                }}
                onPressText={() => setSecurePassEntry(!securePassEntry)}
                subLabelTextStyle={styles.subLabelText}
                text={field.value}
                autoCorrect={false}
                autoCapitalize="none"
                error={error ? fieldState.error?.message : ''}
                showError={false}
              />
            )}
          />

          <CheckboxLabel
            id={1}
            category="Stay signed in"
            value={checked}
            handleChange={handleOption}
            viewStyle={styles.checkedWrap}
          />
          <PGradientButton
            label="log in"
            btnContainer={styles.btnContainer}
            onPress={handleSubmit(onSubmit, onSubmitInvalid)}
            isLoading={loading}
          />
          <TouchableOpacity
            style={styles.forgotPass}
            onPress={onPressResetPass}>
            <Text style={styles.hyperText}>
              <Text style={styles.forgotText}>Forgot your Password?</Text> Reset
              it here
            </Text>
          </TouchableOpacity>
        </PAppContainer>
      </SafeAreaView>
    </PBackgroundImage>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginTop: 36,
    backgroundColor: 'transparent',
  },
  btnContainer: {
    marginTop: 20,
    marginBottom: 48,
  },
  subLabelText: {
    color: PRIMARY,
  },
  hyperText: {
    ...Body2,
    color: PRIMARY,
    lineHeight: 20,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 56,
  },
  checkedWrap: {
    borderWidth: 0,
    paddingLeft: 0,
  },
  txt: {
    ...Body2,
    color: WHITE,
  },
  forgotText: {
    ...Body2,
    color: WHITE,
    lineHeight: 20,
  },
  forgotPass: {
    alignItems: 'center',
  },
});
