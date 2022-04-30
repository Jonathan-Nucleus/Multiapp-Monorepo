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
import EncryptedStorage from 'react-native-encrypted-storage';
import SplashScreen from 'react-native-splash-screen';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTitle from '../../components/common/PTitle';
import PTextInput from '../../components/common/PTextInput';
import PGradientButton from '../../components/common/PGradientButton';
import PTextLine from '../../components/common/PTextLine';
import ErrorText from '../../components/common/ErrorTxt';
import { LOGIN } from '../../graphql/mutation/auth';
import { Body2 } from '../../theme/fonts';
import { BLACK, PRIMARY, WHITE, BLUE200 } from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';
import AppleSvg from '../../assets/icons/apple.svg';
import GoogleSvg from '../../assets/icons/google.svg';
import LinkedinSvg from '../../assets/icons/linkedin.svg';
import CheckedSvg from '../../assets/icons/checked.svg';
import UncheckedSvg from '../../assets/icons/unchecked.svg';

import { setToken } from 'mobile/src/utils/auth-token';
import type { LoginScreen } from 'mobile/src/navigations/AuthStack';

const Login: LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [checked, setChecked] = useState(false);
  const [securePassEntry, setSecurePassEntry] = useState(true);

  const [login] = useMutation(LOGIN);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const handleNextPage = async () => {
    Keyboard.dismiss();
    try {
      const { data } = await login({
        variables: {
          email: email,
          password: pass,
        },
      });
      if (data.login) {
        await setToken(data.login);
        navigation.navigate('Main');
      }
      console.log('logged user', data);
    } catch (e) {
      console.error('login error', e);
    }
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
        {/* <ErrorText error="Your email and/or password are incorrect." /> */}
        <PTextInput
          label="Email"
          onChangeText={(val: string) => setEmail(val)}
          text={email}
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
        />
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
          <Text style={styles.hyperText}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={styles.checkedWrap}>
          <TouchableOpacity onPress={() => setChecked(!checked)}>
            {checked ? <CheckedSvg /> : <UncheckedSvg />}
          </TouchableOpacity>
          <Text style={styles.stayTxt}>Stay signed in</Text>
        </View>
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
          <TouchableOpacity style={styles.icon}>
            <LinkedinSvg />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
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
    borderWidth: 1,
    borderColor: BLUE200,
    borderRadius: 24,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkedWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 20,
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
