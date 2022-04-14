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
import MainHeader from '../../../components/main/Header';
import pStyles from '../../../theme/pStyles';

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
    <View style={pStyles.globalContainer}>
      <MainHeader
        leftIcon={
          <View style={styles.row}>
            <CaretLeft size={28} color={WHITE} />
            <Text style={styles.headerTitle}>Change Password</Text>
          </View>
        }
        onPressLeft={() => navigation.goBack()}
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
    </View>
  );
};

export default ChangePass;

const styles = StyleSheet.create({
  headerTitle: {
    ...Body1,
    color: WHITE,
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
  },
  txt: {
    ...Body2,
    color: WHITE,
  },
});
