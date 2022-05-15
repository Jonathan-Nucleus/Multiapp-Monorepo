import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@apollo/client';
import { NavigationProp } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTitle from '../../components/common/PTitle';
import PTextInput from '../../components/common/PTextInput';
import PGradientButton from '../../components/common/PGradientButton';
import PTextLine from '../../components/common/PTextLine';
import ErrorText from '../../components/common/ErrorTxt';
import { LOGIN } from 'shared/graphql/mutation/auth';
import { Body2 } from '../../theme/fonts';
import { BLACK, PRIMARY, WHITE, WHITE12 } from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';
import AppleSvg from '../../assets/icons/apple.svg';
import GoogleSvg from '../../assets/icons/google.svg';
import LinkedinSvg from '../../assets/icons/linkedin.svg';

import { setToken, TokenAction } from 'mobile/src/utils/auth-token';
import type { LoginScreen } from 'mobile/src/navigations/AuthStack';

import { authenticate } from 'mobile/src/services/auth/google-provider';
import { useLoginOAuth } from 'shared/graphql/mutation/auth/useLoginOAuth';
import CheckboxLabel from '../../components/common/CheckboxLabel';

const Login: LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [checked, setChecked] = useState(false);
  const [securePassEntry, setSecurePassEntry] = useState(true);
  const [error, setError] = useState(false);
  const [login] = useMutation(LOGIN);
  const [loginOAuth] = useLoginOAuth();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const saveAuthToken = async (token: string) => {
    await setToken(token);
    navigation.navigate('Main');
  };

  const handleNextPage = async () => {
    Keyboard.dismiss();
    setError(false);
    try {
      const { data } = await login({
        variables: {
          email: email,
          password: pass,
        },
      });
      if (data.login) {
        saveAuthToken(data.login);
      }
      console.log('logged user', data);
    } catch (e) {
      setError(true);
      console.error('login error', e);
    }
  };

  const googleLogin = async () => {
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
          saveAuthToken(data.loginOAuth);
        }
      } else {
        console.log('Something went wrong');
      }
    } catch (err) {
      console.log('google login err', err);
    }
  };

  const linkedInLogin = async () => {
    console.log('Logging in via linked in');
  };

  return (
    <SafeAreaView style={styles.container}>
      <PHeader centerIcon={<LogoSvg />} />
      <PAppContainer>
        <PTitle title="Log In" />
        <View style={styles.wrap}>
          <Text style={styles.txt}>New here? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Code')}>
            <Text style={styles.hyperText}>SIGN UP WITH CODE</Text>
          </TouchableOpacity>
        </View>
        {error && (
          <ErrorText error="Your email and/or password are incorrect." />
        )}

        <PTextInput
          label="Email"
          onChangeText={(val: string) => setEmail(val)}
          text={email}
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <PTextInput
          label="Password"
          subLabel={securePassEntry ? 'Show' : 'Hide'}
          secureTextEntry={securePassEntry}
          onChangeText={(val: string) => setPass(val)}
          onPressText={() => setSecurePassEntry(!securePassEntry)}
          subLabelTextStyle={styles.subLabelText}
          text={pass}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
          <Text style={styles.hyperText}>Forgot Password?</Text>
        </TouchableOpacity>
        <CheckboxLabel
          id={1}
          category="Stay signed in"
          value={!checked}
          handleChange={() => setChecked(!checked)}
          viewStyle={styles.checkedWrap}
        />
        <PGradientButton
          label="log in"
          btnContainer={styles.btnContainer}
          onPress={handleNextPage}
        />
        <PTextLine title="LOG IN WITH" containerStyle={styles.bottom} />
        <View style={styles.row}>
          <TouchableOpacity style={styles.icon}>
            <AppleSvg />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon} onPress={linkedInLogin}>
            <LinkedinSvg />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon} onPress={googleLogin}>
            <GoogleSvg />
          </TouchableOpacity>
        </View>
      </PAppContainer>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
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
    marginTop: 20,
    marginBottom: 64,
  },
  subLabelText: {
    color: PRIMARY,
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
  },
  icon: {
    borderWidth: 2,
    borderColor: WHITE12,
    borderRadius: 4,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkedWrap: {
    borderWidth: 0,
    paddingLeft: 0,
  },
  txt: {
    ...Body2,
    color: WHITE,
  },
  stayTxt: {
    ...Body2,
    color: WHITE,
    marginLeft: 10,
  },
  signup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 32,
    marginBottom: 80,
  },
});
