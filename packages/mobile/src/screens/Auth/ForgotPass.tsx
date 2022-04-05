import React, { useState } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTitle from '../../components/common/PTitle';
import PTextInput from '../../components/common/PTextInput';
import PGradientButton from '../../components/common/PGradientButton';
import { Body2 } from '../../theme/fonts';
import { BGDARK, PRIMARY, WHITE } from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';

const ForgotPass = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleNextPage = () => {
    Keyboard.dismiss();
    navigation.navigate('Login');
  };

  const handleReset = () => {
    setSent(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <PHeader centerIcon={<LogoSvg />} />
      <PAppContainer>
        <PTitle title={sent ? 'Email Sent' : 'Forgot Password'} />
        {sent ? (
          <Text style={styles.txt}>
            We’ve sent you an email containing a link that will allow you to to
            reset your password. Once you receive the email follow instructions
            to change your password.
          </Text>
        ) : (
          <>
            <Text style={styles.txt}>
              Enter your email / phone number below to reset your password.
            </Text>
            <PTextInput
              label="Email"
              onChangeText={(val: string) => setEmail(val)}
              text={email}
              keyboardType="email-address"
              containerStyle={styles.textContainer}
            />
            <PGradientButton
              label="Reset Password"
              btnContainer={styles.btnContainer}
              onPress={handleReset}
            />
          </>
        )}

        <View style={styles.row}>
          <Text style={styles.txt}>Return to </Text>
          <TouchableOpacity onPress={handleNextPage}>
            <Text style={styles.hyperText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </PAppContainer>
    </SafeAreaView>
  );
};

export default ForgotPass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGDARK,
  },
  textContainer: {
    marginTop: 32,
  },
  btnContainer: {
    marginTop: 20,
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
