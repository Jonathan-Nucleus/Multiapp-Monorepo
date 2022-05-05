import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@apollo/client';
import CheckBox from '@react-native-community/checkbox';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTitle from '../../components/common/PTitle';
import PTextInput from '../../components/common/PTextInput';
import PGradientButton from '../../components/common/PGradientButton';
import PTextLine from '../../components/common/PTextLine';
import ErrorText from '../../components/common/ErrorTxt';
import { REGISTER } from '../../graphql/mutation/auth';
import { Body2, Body2Bold } from '../../theme/fonts';
import {
  BLACK,
  PRIMARY,
  WHITE,
  BLUE200,
  PRIMARYSOLID,
  WHITE12,
  BGHEADER,
  WHITE87,
} from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';
import AppleSvg from '../../assets/icons/apple.svg';
import GoogleSvg from '../../assets/icons/google.svg';
import LinkedinSvg from '../../assets/icons/linkedin.svg';
import CheckCircleSvg from '../../assets/icons/CheckCircle.svg';
import CircleSvg from '../../assets/icons/Circle.svg';

import type { SignupScreen } from 'mobile/src/navigations/AuthStack';
import { setToken } from 'mobile/src/utils/auth-token';
import PMaskTextInput from '../../components/common/PMaskTextInput';
import { validateEmail, validatePassword } from '../../utils/utils';

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
  const [agreed, setAgreed] = useState(false);
  const [read, setRead] = useState(false);
  const [checkedString, setCheckedString] = useState(false);
  const [checkedSpecial, setCheckedSpecial] = useState(false);
  const [checkedNumber, setCheckedNumber] = useState(false);
  const [checkedLength, setCheckedLength] = useState(false);
  const [passError, setPassError] = useState('');
  const [register] = useMutation(REGISTER);

  const disabled = useMemo(() => {
    if (
      firstName &&
      lastName &&
      email &&
      validateEmail(email) &&
      phone &&
      pass &&
      confirmPass &&
      pass === confirmPass &&
      validatePassword(pass) &&
      agreed &&
      read
    ) {
      return false;
    } else if (pass && confirmPass && pass !== confirmPass) {
      setPassError('Confirm Password does not match');
      return;
    }
    setPassError('');
    return true;
  }, [firstName, lastName, email, phone, pass, confirmPass, agreed, read]);

  useEffect(() => {
    const validation = validatePassword(pass);
    setCheckedLength(false);
    setCheckedString(false);
    setCheckedNumber(false);
    setCheckedSpecial(false);
    if (validation.checkedLength) {
      setCheckedLength(true);
    }
    if (validation.checkedString) {
      setCheckedString(true);
    }
    if (validation.checkedSpecial) {
      setCheckedSpecial(true);
    }
    if (validation.checkedNumber) {
      setCheckedNumber(true);
    }
  }, [pass]);

  const handleNextPage = async () => {
    Keyboard.dismiss();
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

  const renderItem = (text: string, validation: boolean) => {
    return (
      <View style={styles.renderItem}>
        {validation ? <CheckCircleSvg /> : <CircleSvg />}
        <Text style={styles.infoTxt}>{text}</Text>
      </View>
    );
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
        <PMaskTextInput
          label="Phone"
          onChangeText={(val) => setPhone(val ?? '')}
          text={phone}
          keyboardType="number-pad"
          labelTextStyle={styles.label}
          mask={'([000])-[000]-[0000]'}
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
          error={passError}
        />
        <View style={styles.info}>
          {renderItem('8-16 characters', checkedLength)}
          {renderItem('Upper and lower case', checkedString)}
          {renderItem('Numbers', checkedNumber)}
          {renderItem('Special characters (ex: @#$)', checkedSpecial)}
        </View>
        <View style={styles.wrap}>
          <CheckBox
            value={agreed}
            boxType="square"
            onCheckColor={WHITE}
            onFillColor={PRIMARY}
            onTintColor={PRIMARY}
            lineWidth={2}
            onValueChange={setAgreed}
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

        <View style={styles.wrap}>
          <CheckBox
            value={read}
            boxType="square"
            onCheckColor={WHITE}
            onFillColor={PRIMARY}
            onTintColor={PRIMARY}
            lineWidth={2}
            onValueChange={setRead}
            style={styles.checkBox}
          />
          <View style={styles.checkBoxLabel}>
            <Text style={styles.txt}>
              I also hereby acknowledge the receipt of
              <Text
                onPress={() =>
                  Linking.openURL(
                    'https://www.prometheusalts.com/legals/brokerage-form-crs-relationship-summary',
                  )
                }>
                <Text style={styles.hyperText}> Prometheus’s Form CRS</Text>
              </Text>
              <Text style={styles.txt}>.</Text>
            </Text>
          </View>
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
});
