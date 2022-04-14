import React, { useState, useMemo } from 'react';
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
import { BLACK, PRIMARY, WHITE } from 'shared/src/colors';
import { Body2 } from '../../theme/fonts';
import LogoSvg from '../../assets/icons/logo.svg';

import type { ResetPassScreen } from 'mobile/src/navigations/AuthStack';

const ResetPass: ResetPassScreen = ({ navigation, route }) => {
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [securePassEntry, setSecurePassEntry] = useState(true);
  const [secureConfirmPassEntry, setSecureConfirmPassEntry] = useState(true);
  const [error, setError] = useState('');

  const [resetPassword] = useMutation(RESET_PASSWORD);

  const disabled = useMemo(() => {
    if (pass && confirmPass && pass === confirmPass) {
      return false;
    }
    return true;
  }, [pass, confirmPass]);

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
        />
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
});
