import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useMutation } from '@apollo/client';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTitle from '../../components/common/PTitle';
import PTextInput from '../../components/common/PTextInput';
import PGradientButton from '../../components/common/PGradientButton';
import ErrorText from '../../components/common/ErrorTxt';
import { RESET_PASSWORD } from '../../graphql/mutation/auth';
import { BGHEADER, BLACK, PRIMARY, WHITE, WHITE12 } from 'shared/src/colors';
import { Body2 } from '../../theme/fonts';
import LogoSvg from '../../assets/icons/logo.svg';
import CheckCircleSvg from '../../assets/icons/CheckCircle.svg';
import CircleSvg from '../../assets/icons/Circle.svg';

import type { ResetPassScreen } from 'mobile/src/navigations/AuthStack';
import { validatePassword } from '../../utils/utils';

const ResetPass: ResetPassScreen = ({ navigation, route }) => {
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [securePassEntry, setSecurePassEntry] = useState(true);
  const [secureConfirmPassEntry, setSecureConfirmPassEntry] = useState(true);
  const [error, setError] = useState('');
  const [checkedString, setCheckedString] = useState(false);
  const [checkedSpecial, setCheckedSpecial] = useState(false);
  const [checkedNumber, setCheckedNumber] = useState(false);
  const [checkedLength, setCheckedLength] = useState(false);
  const [passError, setPassError] = useState('');

  const [resetPassword] = useMutation(RESET_PASSWORD);

  const disabled = useMemo(() => {
    if (
      pass &&
      confirmPass &&
      validatePassword(pass).checkedLength &&
      validatePassword(pass).checkedString &&
      validatePassword(pass).checkedSpecial &&
      validatePassword(pass).checkedNumber &&
      pass === confirmPass
    ) {
      setPassError('');
      return false;
    } else if (pass && confirmPass && pass !== confirmPass) {
      setPassError('Confirm Password does not match');
      return true;
    }
    return true;
  }, [pass, confirmPass]);

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
    setError('');
    if (pass !== confirmPass) {
      setError('Password does not match');
      return;
    }

    try {
      const { data } = await resetPassword({
        variables: {
          email: route.params.email,
          password: pass,
        },
      });
      if (data.login) {
        navigation.navigate('Main');
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
        <PTitle
          title="Welcome back, Elvis!"
          subTitle="Create a new password."
        />
        {!!error && <ErrorText error={error} />}
        <PTextInput
          label="Password"
          subLabel={securePassEntry ? 'Show' : 'Hide'}
          secureTextEntry={securePassEntry}
          onChangeText={(val: string) => setPass(val)}
          onPressText={() => setSecurePassEntry(!securePassEntry)}
          subLabelTextStyle={styles.subLabelText}
          text={pass}
          containerStyle={styles.textContainer}
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
        <PGradientButton
          label="SAVE PASSWORD AND LOGIN"
          btnContainer={styles.btnContainer}
          onPress={handleNextPage}
          disabled={disabled}
        />
        <View style={styles.row}>
          <Text style={styles.txt}>Return to </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.hyperText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </PAppContainer>
    </SafeAreaView>
  );
};

export default ResetPass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  textContainer: {
    marginTop: 21,
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  txt: {
    ...Body2,
    color: WHITE,
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
  info: {
    padding: 16,
    borderRadius: 4,
    borderColor: WHITE12,
    borderWidth: 1,
    backgroundColor: BGHEADER,
  },
});
