import React, { useMemo, useState } from 'react';
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

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  SubmitHandler,
  useForm,
  Controller,
  DefaultValues,
} from 'react-hook-form';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTitle from '../../components/common/PTitle';
import PTextInput from '../../components/common/PTextInput';
import PGradientButton from '../../components/common/PGradientButton';
import { Body2 } from '../../theme/fonts';
import { BLACK, PRIMARY, WHITE } from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';
import { FORGOT_PASSWORD } from 'shared/graphql/mutation/auth';
import SuccessText from '../../components/common/SuccessText';
import ErrorText from '../../components/common/ErrorTxt';

import type { ForgotPassScreen } from 'mobile/src/navigations/AuthStack';

type FormValues = {
  email: string;
};

const schema = yup
  .object({
    email: yup
      .string()
      .email('Must be a valid email')
      .required('Required')
      .default(''),
  })
  .required();

const ForgotPass: ForgotPassScreen = ({ navigation }) => {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);

  const {
    handleSubmit,
    formState: { isValid },
    watch,
    control,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: schema.cast(
      {},
      { assert: false, stripUnknown: true },
    ) as DefaultValues<FormValues>,
  });
  const userEmail = watch('email');

  const onSubmit: SubmitHandler<FormValues> = async ({ email }) => {
    Keyboard.dismiss();
    setErr('');
    try {
      const { data } = await forgotPassword({
        variables: {
          email: email.toLowerCase(),
        },
      });
      if (data.requestPasswordReset) {
        setSent(true);
      } else {
        setErr('Please try again');
      }
    } catch (e) {
      setErr((e as Error).message);
      console.error('forgot password error', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PHeader centerIcon={<LogoSvg />} />
      <PAppContainer style={styles.content}>
        <PTitle title="Forgot Password" />
        {!!err && <ErrorText error={err} />}
        {sent ? (
          <SuccessText
            message={`We sent an email to ${userEmail} with a link to reset your password.`}
          />
        ) : (
          <>
            <Text style={styles.txt}>
              Enter your email below and we’ll send you a link to reset your
              password.
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <PTextInput
                  label="Email"
                  onChangeText={field.onChange}
                  text={field.value}
                  keyboardType="email-address"
                  error={fieldState.error?.message}
                />
              )}
            />
            <PGradientButton
              label="send email"
              btnContainer={styles.btnContainer}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
            />
          </>
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
    backgroundColor: BLACK,
  },
  content: {
    marginTop: 28,
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
