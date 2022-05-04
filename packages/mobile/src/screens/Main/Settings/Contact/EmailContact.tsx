import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useMutation } from '@apollo/client';
import RNPickerSelect from 'react-native-picker-select';

import PTitle from 'mobile/src/components/common/PTitle';
import PTextInput from 'mobile/src/components/common/PTextInput';
import ErrorText from 'mobile/src/components/common/ErrorTxt';
import {
  Body2,
  Body1,
  H6Bold,
  Body1Bold,
  Body2Bold,
} from 'mobile/src/theme/fonts';
import { BLACK, WHITE, GRAY700 } from 'shared/src/colors';
import { CaretLeft, CaretDown } from 'phosphor-react-native';
import PFormLabel from 'mobile/src/components/common/PFormLabel';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import { ProRoleOptions } from 'backend/schemas/user';

const ROLES = Object.keys(ProRoleOptions).map((option) => ({
  value: option,
  label: ProRoleOptions[option].label,
}));

const EmailContact: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [interest, setInterest] = useState('');
  const [info, setInfo] = useState('');

  const handleNextPage = async () => {
    Keyboard.dismiss();
    try {
    } catch (e) {
      console.error('login error', e);
    }
  };

  return (
    <View style={styles.container}>
      {!!error && <ErrorText error={error} />}
      <PTextInput
        label="Email Address"
        onChangeText={(val: string) => setEmail(val)}
        text={email}
        keyboardType="email-address"
        labelTextStyle={styles.label}
      />
      <PFormLabel label="Fund of Interest" textStyle={styles.label} />
      <RNPickerSelect
        onValueChange={(val: string) => setInterest(val)}
        items={ROLES}
        value={interest}
        style={{
          ...pickerSelectStyles,
          iconContainer: {
            top: 16,
            right: 16,
          },
        }}
        Icon={() => <CaretDown size={14} color={WHITE} weight="fill" />}
        placeholder={{ label: null, value: null }}
      />
      <PTextInput
        label="Additional Information"
        onChangeText={(val: string) => setInfo(val)}
        text={info}
        multiline={true}
        underlineColorAndroid="transparent"
        numberOfLines={4}
        labelTextStyle={styles.label}
      />
      <View style={styles.bottom}>
        <TouchableOpacity>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <PGradientButton
          label="Submit"
          btnContainer={styles.btnContainer}
          onPress={handleNextPage}
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
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    ...Body2Bold,
  },
  textInput: {
    borderRadius: 16,
    height: 56,
    fontSize: 24,
    paddingHorizontal: 12,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    ...Body1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: WHITE,
    width: '100%',
    borderColor: WHITE,
    backgroundColor: GRAY700,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  inputAndroid: {
    ...Body1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: WHITE,
    borderColor: WHITE,
    backgroundColor: GRAY700,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
});
