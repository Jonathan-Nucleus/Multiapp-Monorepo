import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { CaretLeft, ShieldCheck } from 'phosphor-react-native';
import {
  useForm,
  DefaultValues,
  Controller,
  SubmitHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import MainHeader from 'mobile/src/components/main/Header';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PTitle from 'mobile/src/components/common/PTitle';
import PTextInput from 'mobile/src/components/common/PTextInput';
import PPicker from 'mobile/src/components/common/PPicker';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import { showMessage } from 'mobile/src/services/ToastService';
import { Body2, H6Bold, Body1Bold, Body2Bold } from 'mobile/src/theme/fonts';
import { BLACK, WHITE, SUCCESS, GRAY600, GRAY900 } from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';
import {
  useProRequest,
  ProRequest,
} from 'shared/graphql/mutation/account/useProRequest';
import { ProRoleOptions } from 'backend/schemas/user';

import { BecomeProScreen } from 'mobile/src/navigations/MoreStack';

type FormValues = ProRequest;

const schema = yup
  .object({
    role: yup.string().required('Required').default(''),
    otherRole: yup
      .string()
      .when('role', {
        is: 'OTHER',
        then: yup.string().required(),
      })
      .default(''),
    email: yup.string().email().required('Required').default(''),
    organization: yup.string().required('Required').default(''),
    position: yup.string().required('Required').default(''),
    info: yup.string().required('Required').default(''),
  })
  .required();

const ROLES = Object.keys(ProRoleOptions).map((option) => ({
  value: option,
  label: ProRoleOptions[option].label,
}));

const BecomePro: BecomeProScreen = ({ navigation }) => {
  const [proRequest] = useProRequest();

  const {
    handleSubmit,
    control,
    watch,
    formState: { isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: schema.cast(
      {},
      { assert: false, stripUnknown: true },
    ) as DefaultValues<FormValues>,
  });

  const watchRole = watch('role');

  const onSubmit: SubmitHandler<FormValues> = async ({
    role,
    otherRole,
    email,
    organization,
    position,
    info,
  }) => {
    try {
      const { data } = await proRequest({
        variables: {
          request: {
            role,
            otherRole,
            email,
            organization,
            position,
            info,
          },
        },
      });
      if (data?.proRequest) {
        navigation.navigate('VerificationSuccess');
      }
    } catch (err) {
      console.error('login error', err);
      showMessage('error', 'Uh oh! We encountered a problem.');
    }
  };

  return (
    <View style={styles.container}>
      <MainHeader
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        onPressLeft={() => navigation.goBack()}
      />
      <PAppContainer>
        <PTitle
          title="Are you a Pro?"
          style={styles.textContainer}
          textStyle={styles.title}
        />
        <Text style={styles.description}>
          Verified Pros have a green badge{' '}
          <ShieldCheck size={14} color={SUCCESS} weight="fill" /> next to their
          name to show that Prometheus has confirmed their status as a
          professional.
        </Text>
        <PPicker control={control} name="role" label="I am a" options={ROLES} />
        {watchRole === 'OTHER' && (
          <Controller
            control={control}
            name="otherRole"
            render={({ field, fieldState }) => (
              <PTextInput
                label="What is your title"
                onChangeText={field.onChange}
                text={field.value}
                multiline={true}
                underlineColorAndroid="transparent"
                numberOfLines={4}
                labelTextStyle={styles.label}
                textContainerStyle={[
                  styles.inputContainerStyle,
                  styles.longInput,
                ]}
                error={fieldState.error?.message}
                autoCapitalize="sentences"
                autoCorrect={true}
                maxLength={100}
              />
            )}
          />
        )}
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <PTextInput
              label="Work Email"
              onChangeText={field.onChange}
              text={field.value}
              keyboardType="email-address"
              labelTextStyle={styles.label}
              textContainerStyle={styles.inputContainerStyle}
              autoCapitalize="none"
              autoCorrect={false}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="organization"
          render={({ field, fieldState }) => (
            <PTextInput
              label="Organization"
              onChangeText={field.onChange}
              text={field.value}
              labelTextStyle={styles.label}
              textContainerStyle={styles.inputContainerStyle}
              error={fieldState.error?.message}
              autoCapitalize="words"
            />
          )}
        />
        <Controller
          control={control}
          name="position"
          render={({ field, fieldState }) => (
            <PTextInput
              label="Job Title / Role"
              onChangeText={field.onChange}
              text={field.value}
              labelTextStyle={styles.label}
              textContainerStyle={styles.inputContainerStyle}
              error={fieldState.error?.message}
              autoCapitalize="words"
            />
          )}
        />
        <Controller
          control={control}
          name="info"
          render={({ field, fieldState }) => (
            <PTextInput
              label="Additional Information"
              onChangeText={field.onChange}
              text={field.value}
              multiline={true}
              underlineColorAndroid="transparent"
              numberOfLines={4}
              labelTextStyle={styles.label}
              textContainerStyle={[
                styles.inputContainerStyle,
                styles.longInput,
              ]}
              error={fieldState.error?.message}
              autoCapitalize="sentences"
              autoCorrect={true}
            />
          )}
        />
      </PAppContainer>
      <View style={styles.bottom}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={(pressed) => (pressed ? pStyles.pressedStyle : null)}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <PGradientButton
          label="Submit"
          btnContainer={styles.btnContainer}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
        />
      </View>
    </View>
  );
};

export default BecomePro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  textContainer: {
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 26,
  },
  title: {
    ...H6Bold,
    color: WHITE,
  },
  description: {
    color: WHITE,
    ...Body2,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    ...Body2Bold,
  },
  inputContainerStyle: {
    backgroundColor: GRAY900,
    borderColor: GRAY600,
  },
  longInput: {
    height: 140,
  },
  cancel: {
    ...Body1Bold,
    color: WHITE,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 32,
    marginBottom: 20,
  },
  btnContainer: {
    width: 220,
  },
});
