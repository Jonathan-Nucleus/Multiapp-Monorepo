import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { PhoneCall, Envelope } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useForm,
  FieldValues,
  DefaultValues,
  Controller,
} from 'react-hook-form';
import 'yup-phone';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PLabel from 'mobile/src/components/common/PLabel';
import PTextInput from 'mobile/src/components/common/PTextInput';
import SegmentedInput from 'mobile/src/components/common/SegmentedInput';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import AccreditationHeader from './AccreditationHeader';
import { showMessage } from 'mobile/src/services/utils';
import pStyles from 'mobile/src/theme/pStyles';
import {
  Body1Bold,
  Body2,
  Body2Medium,
  Body2Bold,
  H6Bold,
} from 'mobile/src/theme/fonts';
import {
  BGDARK,
  BLACK,
  GRAY100,
  GRAY600,
  PRIMARYSOLID,
  PRIMARYSOLID7,
  WHITE,
  WHITE60,
} from 'shared/src/colors';

import { useSaveQuestionnaire } from 'mobile/src/graphql/mutation/account/useSaveQuestionnaire';
import { FAIntakeScreen } from 'mobile/src/navigations/AccreditationStack';
import { SOMETHING_WRONG } from 'shared/src/constants';

export type FormData = {
  firmName: string;
  firmCrd: string;
  phone: string;
  email: string;
  contactMethod: 'PHONE' | 'EMAIL';
};

export const formSchema = yup
  .object({
    firmName: yup.string().required('Required').default(''),
    firmCrd: yup.string().required('Required').default(''),
    phone: yup
      .string()
      .phone(undefined, false, 'Oops, looks like an invalid phone number')
      .required('Required')
      .default(''),
    email: yup
      .string()
      .email('Must be a valid email')
      .required('Required')
      .default(''),
    contactMethod: yup.mixed().oneOf(['PHONE', 'EMAIL']).required('Required'),
  })
  .required();

const FAIntake: FAIntakeScreen = ({ navigation }) => {
  const [saveQuestionnaire] = useSaveQuestionnaire();
  const { register, handleSubmit, control, formState } = useForm<
    yup.InferType<typeof formSchema>
  >({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
    defaultValues: formSchema.cast(
      {},
      { assert: false, stripUnknown: true },
    ) as DefaultValues<FormData>,
  });

  const goBack = () => navigation.goBack();
  const onSubmit = async ({
    firmName,
    firmCrd,
    phone,
    email,
    contactMethod,
  }: FormData) => {
    try {
      const { data } = await saveQuestionnaire({
        variables: {
          questionnaire: {
            class: 'ADVISOR',
            status: [],
            date: new Date(),
            advisorRequest: {
              firm: firmName,
              crd: firmCrd,
              phone,
              email,
              contactMethod,
            },
          },
        },
      });

      data?.saveQuestionnaire?.accreditation
        ? navigation.push('AccreditationResult', {
            accreditation: 'NONE',
            baseStatus: [],
            investorClass: 'ADVISOR',
          })
        : showMessage('error', SOMETHING_WRONG);
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  return (
    <View style={pStyles.globalContainer}>
      <AccreditationHeader
        centerLabel="Investor Accreditation"
        handleBack={goBack}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <PLabel
          label="Glad to have you aboard!"
          textStyle={styles.titleLabel}
        />
        <PLabel
          label="Please fill in your details so our Wealth Management team can reach out to you."
          textStyle={styles.descriptionLabel}
        />
        <View style={styles.fieldContainer}>
          <Controller
            control={control}
            name="firmName"
            render={({ field, fieldState }) => (
              <PTextInput
                label="Firm Name"
                text={field.value}
                onChangeText={field.onChange}
                textContainerStyle={styles.textField}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="firmCrd"
            render={({ field, fieldState }) => (
              <PTextInput
                label="Firm CRD#"
                text={field.value}
                onChangeText={field.onChange}
                textContainerStyle={styles.textField}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <PTextInput
                label="Phone Number"
                text={field.value}
                onChangeText={field.onChange}
                textContainerStyle={styles.textField}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <PTextInput
                label="Email Address"
                text={field.value}
                onChangeText={field.onChange}
                textContainerStyle={styles.textField}
                error={fieldState.error?.message}
              />
            )}
          />
          <View style={styles.contactMethodContainer}>
            <PLabel
              label="Choose a contact method:"
              textStyle={styles.contactLabel}
            />
            <SegmentedInput
              control={control}
              name="contactMethod"
              options={[
                {
                  title: (selected) => (
                    <View style={styles.row}>
                      <PhoneCall size={24} color={selected ? BLACK : WHITE} />
                      <Text
                        style={[
                          styles.btnLabel,
                          selected ? styles.selectedLabel : null,
                        ]}>
                        Phone
                      </Text>
                    </View>
                  ),
                  value: 'PHONE',
                },
                {
                  title: (selected) => (
                    <View style={styles.row}>
                      <Envelope size={24} color={selected ? BLACK : WHITE} />
                      <Text
                        style={[
                          styles.btnLabel,
                          selected ? styles.selectedLabel : null,
                        ]}>
                        Email
                      </Text>
                    </View>
                  ),
                  value: 'EMAIL',
                },
              ]}
            />
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed ? pStyles.pressedStyle : null,
            ]}
            onPress={goBack}>
            <PLabel label="Back" />
          </Pressable>
          <PGradientButton
            label="Next"
            textStyle={styles.nextButtonLabel}
            btnContainer={styles.nextButton}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default FAIntake;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    alignItems: 'center',
  },
  titleLabel: {
    ...H6Bold,
    marginBottom: 8,
  },
  descriptionLabel: {
    color: GRAY100,
    marginBottom: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
  fieldContainer: {
    marginTop: 16,
    flex: 1,
    alignSelf: 'stretch',
  },
  textField: {
    height: 40,
    borderColor: GRAY600,
  },
  contactMethodContainer: {
    marginTop: 16,
  },
  contactLabel: {
    ...Body1Bold,
    color: WHITE,
    fontWeight: '700',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLabel: {
    color: WHITE,
    alignSelf: 'center',
    marginLeft: 8,
    ...Body2Bold,
  },
  selectedLabel: {
    color: BLACK,
  },
  bottomContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 80,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  nextButtonLabel: {
    textTransform: 'none',
  },
  nextButton: {
    flex: 2,
  },
});
