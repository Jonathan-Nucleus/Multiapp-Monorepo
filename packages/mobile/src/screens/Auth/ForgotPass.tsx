import React, { useState } from 'react';
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

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTitle from '../../components/common/PTitle';
import PTextInput from '../../components/common/PTextInput';
import PGradientButton from '../../components/common/PGradientButton';
import { Body2 } from '../../theme/fonts';
import { BGDARK, PRIMARY, WHITE } from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';
import { FORGOT_PASSWORD } from '../../graphql/mutation/auth';
import SuccessText from '../../components/common/SuccessText';
import ErrorText from '../../components/common/ErrorTxt';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ForgotPass: React.FC<RouterProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);

  const handleReset = async () => {
    Keyboard.dismiss();
    try {
      const { data } = await forgotPassword({
        variables: {
          email: email,
        },
      });
      console.log(123, data);
      if (data.requestPasswordReset) {
        setSent(true);
      } else {
        setErr('Please try again');
      }
    } catch (e) {
      console.error('forgot password error', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PHeader centerIcon={<LogoSvg />} />
      <PAppContainer>
        <PTitle title="Forgot Password" />
        {!!err && <ErrorText error={err} />}
        {sent ? (
          <SuccessText
            message={`We sent an email to ${email} with a link to reset your password.`}
          />
        ) : (
          <>
            <Text style={styles.txt}>
              Enter your email below and we’ll send you a link to reset your
              password.
            </Text>
            <PTextInput
              label="Email"
              onChangeText={(val: string) => {
                setErr('');
                setEmail(val);
              }}
              text={email}
              keyboardType="email-address"
              containerStyle={styles.textContainer}
            />
            <PGradientButton
              label="send email"
              btnContainer={styles.btnContainer}
              onPress={handleReset}
            />
          </>
        )}
        {sent && (
          <PGradientButton
            label="Reset Password"
            btnContainer={styles.btnContainer}
            onPress={() => navigation.navigate('ResetPass', { email })}
          />
        )}
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
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
});
