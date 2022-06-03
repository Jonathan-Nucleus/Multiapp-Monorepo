import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useForm, DefaultValues, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PTextInput from 'mobile/src/components/common/PTextInput';
import { Body1Bold, Body2Bold } from 'mobile/src/theme/fonts';
import { BLACK, WHITE, GRAY600, GRAY900 } from 'shared/src/colors';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import PPicker from 'mobile/src/components/common/PPicker';

import { HelpRequest } from 'shared/graphql/mutation/account';

interface Fund {
  value: string;
  label: string;
}

type FormValues = {
  email: string;
  fundId: string;
  message: string;
};

const schema = yup
  .object({
    email: yup.string().email().required('Required').default(''),
    fundId: yup.string().required('Required').default(''),
    message: yup.string().required('Required').default(''),
  })
  .required();

interface Props {
  handleContact: (request: HelpRequest) => void;
  funds: Fund[];
  initialFund?: string;
}

const EmailContact: React.FC<Props> = ({
  handleContact,
  funds,
  initialFund,
}) => {
  console.log('initial fund', initialFund);
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: schema.cast(
      { fundId: initialFund },
      { assert: false, stripUnknown: true },
    ) as DefaultValues<FormValues>,
  });

  const onSubmit = ({ email, fundId, message }: FormValues): void => {
    handleContact({
      fundId,
      message,
      email,
      type: 'EMAIL',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <PTextInput
              label="Email Address"
              onChangeText={field.onChange}
              text={field.value}
              keyboardType="email-address"
              labelTextStyle={styles.label}
              autoCapitalize="none"
              autoCorrect={false}
              errorStyle={styles.errorStyle}
              textContainerStyle={styles.inputContainerStyle}
            />
          )}
        />
        <PPicker
          control={control}
          name="fundId"
          label="Fund of Interest"
          options={funds}
          errorStyle={styles.errorStyle}
        />
        <Controller
          control={control}
          name="message"
          render={({ field }) => (
            <PTextInput
              label="Additional Information"
              onChangeText={field.onChange}
              text={field.value}
              multiline={true}
              underlineColorAndroid="transparent"
              numberOfLines={4}
              labelTextStyle={[styles.label]}
              errorStyle={styles.errorStyle}
              textContainerStyle={[styles.textArea, styles.inputContainerStyle]}
              autoCorrect={true}
              autoCapitalize="sentences"
            />
          )}
        />
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
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

export default EmailContact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
    paddingTop: 16,
  },
  formContainer: {
    flex: 1,
  },
  errorStyle: {
    height: 0,
  },
  label: {
    ...Body2Bold,
  },
  inputContainerStyle: {
    backgroundColor: GRAY900,
    borderColor: GRAY600,
  },
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
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
    marginBottom: 24,
  },
  btnContainer: {
    width: 220,
  },
});
