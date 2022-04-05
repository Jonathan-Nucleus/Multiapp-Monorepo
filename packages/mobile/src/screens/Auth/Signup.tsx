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
import PTextLine from '../../components/common/PTextLine';
import { Body2 } from '../../theme/fonts';
import { BGDARK, PRIMARY, WHITE, BLUE200 } from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';
import AppleSvg from '../../assets/icons/apple.svg';
import GoogleSvg from '../../assets/icons/google.svg';
import LinkedinSvg from '../../assets/icons/linkedin.svg';

const Signup = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [securePassEntry, setSecurePassEntry] = useState(true);
  const [secureConfirmPassEntry, setSecureConfirmPassEntry] = useState(true);

  const handleNextPage = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <PHeader centerIcon={<LogoSvg />} />
      <PAppContainer>
        <PTitle title="You’re in!" subTitle="We a few more details..." />
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
          <TouchableOpacity>
            <Text style={styles.hyperText}>Terms</Text>
          </TouchableOpacity>
          <Text style={styles.txt}>, </Text>
          <TouchableOpacity>
            <Text style={styles.hyperText}>Community</Text>
          </TouchableOpacity>
          <Text style={styles.txt}>and </Text>
          <TouchableOpacity>
            <Text style={styles.hyperText}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.txt}>.</Text>
        </View>
        <PGradientButton
          label="SIGN UP"
          btnContainer={styles.btnContainer}
          onPress={handleNextPage}
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
    backgroundColor: BGDARK,
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
