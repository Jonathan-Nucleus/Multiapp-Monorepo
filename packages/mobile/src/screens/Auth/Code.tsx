import React, { useState } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { useApolloClient } from '@apollo/client';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTitle from '../../components/common/PTitle';
import PTextInput from '../../components/common/PTextInput';
import ErrorText from '../../components/common/ErrorTxt';
import { BLACK, PRIMARY, WHITE } from 'shared/src/colors';
import PGradientButton from '../../components/common/PGradientButton';
import { Body2 } from '../../theme/fonts';
import PTextLine from '../../components/common/PTextLine';
import LogoSvg from '../../assets/icons/logo.svg';
import { VERIFY_INVITE } from '../../graphql/query/auth';

import type { CodeScreen } from 'mobile/src/navigations/AuthStack';

const CodeView: CodeScreen = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const client = useApolloClient();

  const handleVerifyCode = async () => {
    Keyboard.dismiss();
    setError(false);
    try {
      const { data } = await client.query({
        query: VERIFY_INVITE,
        variables: { code },
      });
      if (data.verifyInvite) {
        navigation.navigate('Signup', { code });
        return;
      }
      setError(true);
    } catch (err) {
      setError(true);
      console.log('err=======>', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PHeader centerIcon={<LogoSvg />} />
      <PAppContainer>
        <PTitle title="Join the inner circle!" />
        {error && <ErrorText error="Verification code does not matched" />}
        <PTextInput
          label="Enter Code"
          onChangeText={(val: string) => {
            setCode(val);
            // setError(false);
          }}
          text={code}
          onSubmitEditing={handleVerifyCode}
          autoFocus={true}
          containerStyle={styles.textContainer}
          textInputStyle={styles.textInput}
        />
        <PGradientButton
          label="next"
          btnContainer={styles.btnContainer}
          onPress={handleVerifyCode}
        />
        <View style={styles.wrap}>
          <Text style={styles.txt}>Already here? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.hyperText}>Login</Text>
          </TouchableOpacity>
        </View>
        {/*<View style={styles.bottom}>
          <PTextLine title="OR" />
          <Text style={styles.invite}>request an invite</Text>
        </View>*/}
      </PAppContainer>
    </SafeAreaView>
  );
};

export default CodeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  textContainer: {
    marginTop: 17,
  },
  textInput: {
    borderRadius: 16,
    height: 56,
    fontSize: 24,
    paddingHorizontal: 12,
  },
  btnContainer: {
    marginTop: 4,
  },
  bottom: {
    marginTop: 106,
  },
  invite: {
    color: PRIMARY,
    ...Body2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 25,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  hyperText: {
    ...Body2,
    color: PRIMARY,
  },
  txt: {
    ...Body2,
    color: WHITE,
  },
});
