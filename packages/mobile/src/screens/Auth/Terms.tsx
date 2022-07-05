import React, { useState, Fragment, useCallback } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PGradientButton from '../../components/common/PGradientButton';
import { Body2 } from '../../theme/fonts';
import { DANGER, PRIMARY, WHITE } from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';

import type { TermsScreen } from 'mobile/src/navigations/AuthStack';
import { setToken } from 'mobile/src/utils/auth-token';

import { useRegister } from 'shared/graphql/mutation/auth/useRegister';
import PBackgroundImage from '../../components/common/PBackgroundImage';
import { showMessage } from '../../services/ToastService';
import CheckBox from '@react-native-community/checkbox';
import PTitle from '../../components/common/PTitle';

const Terms: TermsScreen = ({ navigation, route }) => {
  const [register] = useRegister();
  const { email, firstName, lastName, password, inviteCode } = route.params;
  const [loading, setLoading] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = async () => {
    if (termsChecked) {
      Keyboard.dismiss();
      setLoading(true);
      setErrorMsg('');

      try {
        const { data } = await register({
          variables: {
            user: {
              email,
              firstName,
              lastName,
              inviteCode,
              password,
            },
          },
        });

        console.log('Registration result', data);
        if (data?.register) {
          await setToken(data.register);
          navigation.navigate('Topic');
        }
      } catch (err) {
        console.log('error', err);
        const error = err instanceof Error ? err.message : 'Unexpected error';
        showMessage('error', error);
        setErrorMsg(error);
      }

      setLoading(false);
    } else {
      const error = 'Please agree to the Terms & Services.';
      setErrorMsg(error);
      showMessage('error', error);
    }
  };

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onChangeCheckbox = useCallback(() => {
    setTermsChecked(!termsChecked);
    setErrorMsg('');
  }, [termsChecked]);

  return (
    <PBackgroundImage>
      <SafeAreaView style={styles.container}>
        <PAppContainer style={styles.content}>
          <PHeader
            centerIcon={<LogoSvg />}
            outerContainerStyle={styles.header}
          />
          <>
            <PTitle style={styles.title} title="Terms & Services" />
            <View style={styles.wrap}>
              <CheckBox
                onValueChange={onChangeCheckbox}
                value={termsChecked}
                boxType="square"
                onCheckColor={WHITE}
                onFillColor={PRIMARY}
                onTintColor={PRIMARY}
                tintColor={
                  errorMsg !== '' && !termsChecked
                    ? DANGER
                    : termsChecked
                    ? PRIMARY
                    : WHITE
                }
                lineWidth={2}
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
            <PGradientButton
              label={'Sign up'}
              btnContainer={styles.btnContainer}
              onPress={handleNext}
              isLoading={loading}
            />
            <TouchableOpacity style={styles.btnBack} onPress={handleBack}>
              <Text style={styles.hyperText}>Go Back</Text>
            </TouchableOpacity>
          </>
        </PAppContainer>
      </SafeAreaView>
    </PBackgroundImage>
  );
};

export default Terms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: 'transparent',
  },
  header: {
    paddingBottom: 48,
  },
  title: {
    fontSize: 20,
  },
  btnContainer: {
    marginVertical: 24,
  },
  wrap: {
    marginVertical: 16,
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
  checkBox: {
    width: 20,
    height: 20,
    borderColor: 'red',
  },
  checkBoxLabel: {
    flex: 1,
    marginLeft: 10,
  },
  btnBack: {
    alignItems: 'center',
    marginTop: 16,
  },
});
