import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import EncryptedStorage from 'react-native-encrypted-storage';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTitle from '../../components/common/PTitle';
import PTextInput from '../../components/common/PTextInput';
import PGradientButton from '../../components/common/PGradientButton';
import PTextLine from '../../components/common/PTextLine';
import ErrorText from '../../components/common/ErrorTxt';
import { REGISTER } from '../../graphql/mutation/auth';
import { Body2 } from '../../theme/fonts';
import { BLACK, PRIMARY, WHITE, BLUE200 } from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';
import AppleSvg from '../../assets/icons/apple.svg';
import GoogleSvg from '../../assets/icons/google.svg';
import LinkedinSvg from '../../assets/icons/linkedin.svg';

import type { SignupScreen } from 'mobile/src/navigations/AuthStack';
import { setToken } from 'mobile/src/utils/auth-token';

const Signup: SignupScreen = ({ navigation, route }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [securePassEntry, setSecurePassEntry] = useState(true);
  const [secureConfirmPassEntry, setSecureConfirmPassEntry] = useState(true);
  const [error, setError] = useState('');

  const [register] = useMutation(REGISTER);

  const disabled = useMemo(() => {
    if (
      firstName &&
      lastName &&
      email &&
      phone &&
      pass &&
      confirmPass &&
      pass === confirmPass
    ) {
      return false;
    }
    return true;
  }, [firstName, lastName, email, phone, pass, confirmPass]);

  const handleNextPage = async () => {
    Keyboard.dismiss();
    if (pass !== confirmPass) {
      setError('Password does not match');
      return;
    }
    try {
      const { data } = await register({
        variables: {
          user: {
            email,
            firstName,
            lastName,
            inviteCode: route.params.code,
            password: pass,
          },
        },
      });
      if (data.register) {
        await setToken(data.register);
        navigation.navigate('Topic');
        return;
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PHeader centerIcon={<LogoSvg />} />
      <PAppContainer>
        <PTitle title="You’re in!" subTitle="We a few more details..." />
        {!!error && <ErrorText error="Verification code does not matched" />}
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
          label="Email"
          onChangeText={(val: string) => setEmail(val)}
          text={email}
          keyboardType="email-address"
        />
        <PTextInput
          label="Phone"
          onChangeText={(val: string) => setPhone(val)}
          text={phone}
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
        <PTextInput
          label="Confirm Password"
          subLabel={secureConfirmPassEntry ? 'Show' : 'Hide'}
          secureTextEntry={secureConfirmPassEntry}
          onChangeText={(val: string) => setConfirmPass(val)}
          onPressText={() => setSecureConfirmPassEntry(!secureConfirmPassEntry)}
          text={confirmPass}
          subLabelTextStyle={styles.subLabelText}
        />
        <View style={styles.wrap}>
          <Text style={styles.txt}>I agree to the Prometheus Alts </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://prometheusalts.com/legals/disclosure-library',
              )
            }>
            <Text style={styles.hyperText}>Terms</Text>
          </TouchableOpacity>
          <Text style={styles.txt}>, </Text>
          <TouchableOpacity>
            <Text style={styles.hyperText}>Community</Text>
          </TouchableOpacity>
          <Text style={styles.txt}>and </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://prometheusalts.com/legals/disclosure-library',
              )
            }>
            <Text style={styles.hyperText}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.txt}>.</Text>
        </View>
        <PGradientButton
          label="SIGN UP"
          btnContainer={styles.btnContainer}
          onPress={handleNextPage}
          disabled={disabled}
        />
        <PTextLine title="OR, SIGN UP WITH" containerStyle={styles.bottom} />
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

export default Signup;

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
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  txt: {
    ...Body2,
    color: WHITE,
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
});
