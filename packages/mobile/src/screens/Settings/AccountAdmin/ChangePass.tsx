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
import { CaretLeft, MagnifyingGlass } from 'phosphor-react-native';

import PAppContainer from '../../../components/common/PAppContainer';
import PHeader from '../../../components/common/PHeader';
import PTextInput from '../../../components/common/PTextInput';
import PGradientButton from '../../../components/common/PGradientButton';
import ErrorText from '../../../components/common/ErrorTxt';
import { BGDARK, PRIMARY, WHITE } from 'shared/src/colors';
import { Body1, Body2 } from '../../../theme/fonts';

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const ChangePass: React.FC<RouterProps> = ({ navigation }) => {
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [securePassEntry, setSecurePassEntry] = useState(true);
  const [secureConfirmPassEntry, setSecureConfirmPassEntry] = useState(true);
  const [error, setError] = useState('');

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
  };

  return (
    <SafeAreaView style={styles.container}>
      <PHeader
        centerIcon={<Text style={styles.headerTitle}>Change Password</Text>}
        containerStyle={styles.headerContainer}
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        rightIcon={<MagnifyingGlass size={28} color={WHITE} />}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => console.log(1231)}
      />
      <PAppContainer>
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
          label="change password"
          btnContainer={styles.btnContainer}
          onPress={handleNextPage}
          disabled={disabled}
        />
      </PAppContainer>
    </SafeAreaView>
  );
};

export default ChangePass;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: BGDARK,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    paddingTop: 0,
    marginBottom: 0,
    justifyContent: 'space-between',
  },
  headerTitle: {
    ...Body1,
    color: WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: BGDARK,
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
