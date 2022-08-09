import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTextInput from '../../components/common/PTextInput';
import { PRIMARY, WHITE } from 'shared/src/colors';
import PGradientButton from '../../components/common/PGradientButton';
import { Body2 } from '../../theme/fonts';
import LogoSvg from '../../assets/icons/logo.svg';

import type { CodeScreen } from 'mobile/src/navigations/AuthStack';
import { useVerifyInviteLazy } from 'shared/graphql/query/auth/useVerifyInvite';
import PBackgroundImage from '../../components/common/PBackgroundImage';
import { showMessage } from '../../services/ToastService';
import PText from '../../components/common/PText';

const ERROR_MSG = 'The code you entered was invalid.';

const CodeView: CodeScreen = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [verifyInvite] = useVerifyInviteLazy();
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerifyCode = async () => {
    Keyboard.dismiss();
    setErrorMsg('');
    try {
      const { data } = await verifyInvite({ variables: { code } });
      if (data?.verifyInvite) {
        navigation.navigate('Signup', { code });
        return;
      }
      showMessage('error', ERROR_MSG);
      setErrorMsg(ERROR_MSG);
    } catch (err) {
      showMessage('error', ERROR_MSG);
      setErrorMsg(ERROR_MSG);
      console.log('err=======>', err);
    }
  };

  const handleChangeCode = useCallback((val: string) => {
    setCode(val.toUpperCase());
    setErrorMsg('');
  }, []);

  const onPressRequestInvite = useCallback(() => {
    Linking.openURL('https://prometheusalts.com/sign-up');
  }, []);

  return (
    <PBackgroundImage>
      <SafeAreaView style={styles.container} edges={['left', 'right', 'top']}>
        <PHeader centerIcon={<LogoSvg />} />
        <PAppContainer style={styles.content}>
          <PTextInput
            label="Enter Code"
            onChangeText={handleChangeCode}
            text={code}
            onSubmitEditing={handleVerifyCode}
            autoFocus={true}
            containerStyle={styles.textContainer}
            textContainerStyle={styles.textInputContainer}
            textInputStyle={styles.textInput}
            error={errorMsg}
            showError={false}
          />
          <PGradientButton
            label="next"
            btnContainer={styles.btnContainer}
            onPress={handleVerifyCode}
            disabled={code === ''}
          />

          <View style={styles.bottom}>
            <PText style={styles.txtOR}>OR</PText>
            <TouchableOpacity onPress={onPressRequestInvite}>
              <PText style={styles.invite}>request an invite</PText>
            </TouchableOpacity>
          </View>
        </PAppContainer>
        <View style={styles.wrap}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.hyperText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </PBackgroundImage>
  );
};

export default CodeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: 'transparent',
    paddingTop: 48,
  },
  textContainer: {
    marginTop: 16,
  },
  textInputContainer: {
    marginTop: 4,
    borderRadius: 16,
    height: 56,
  },
  textInput: {
    fontSize: 24,
    paddingHorizontal: 12,
  },
  btnContainer: {
    marginTop: 4,
  },
  bottom: {
    marginTop: 48,
    alignItems: 'center',
  },
  invite: {
    color: PRIMARY,
    ...Body2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 16,
  },
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 46,
  },
  hyperText: {
    ...Body2,
    color: PRIMARY,
  },
  txtOR: {
    ...Body2,
    color: WHITE,
  },
});
