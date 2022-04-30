import React, { useState } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { CaretLeft, ShieldCheck, CaretDown } from 'phosphor-react-native';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PTitle from 'mobile/src/components/common/PTitle';
import PTextInput from 'mobile/src/components/common/PTextInput';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import ErrorText from 'mobile/src/components/common/ErrorTxt';
import {
  Body2,
  Body1,
  H6Bold,
  Body1Bold,
  Body2Bold,
} from 'mobile/src/theme/fonts';
import { BLACK, WHITE, SUCCESS, GRAY700 } from 'shared/src/colors';
import MainHeader from 'mobile/src/components/main/Header';
import PFormLabel from 'mobile/src/components/common/PFormLabel';
import { useProRequest } from 'mobile/src/graphql/mutation/account';

interface BecomeProProps {
  navigation: NavigationProp<ParamListBase>;
}

const DATA = [
  { label: 'Fund Manager', value: 'MANAGER' },
  { label: 'Journalist', value: 'JOURNALIST' },
  { label: 'C level manager', value: 'C_LEVEL' },
  { label: 'Founder', value: 'FOUNDER' },
  { label: 'Ex fund manager', value: 'EX_MANAGER' },
  { label: 'Other', value: 'OTHER' },
];

const BecomePro: React.FC<BecomeProProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const [info, setInfo] = useState('');
  const [organization, setOrganization] = useState('');

  const [proRequest] = useProRequest();

  const handleNextPage = async () => {
    setError('');
    Keyboard.dismiss();
    try {
      const { data } = await proRequest({
        variables: {
          request: {
            role,
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
      setError((err as Error).message);
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
          title="Are you a pro?"
          style={styles.textContainer}
          textStyle={styles.title}
        />
        <Text style={styles.description}>
          Verified pros have a green badge{' '}
          <ShieldCheck size={14} color={SUCCESS} weight="fill" /> next to their
          name to show that Prometheus has confirmed their status as a
          professional.
        </Text>
        {!!error && <ErrorText error={error} />}
        <PFormLabel label="I am a " textStyle={styles.label} />
        <RNPickerSelect
          onValueChange={(val) => setRole(val)}
          items={DATA}
          value={role}
          style={{
            ...pickerSelectStyles,
            iconContainer: {
              top: 16,
              right: 16,
            },
          }}
          Icon={<CaretDown size={14} color={WHITE} weight="fill" />}
          placeholder={{ label: null, value: null }}
        />
        <PTextInput
          label="Work Email"
          onChangeText={(val: string) => setEmail(val)}
          text={email}
          keyboardType="email-address"
          labelTextStyle={styles.label}
        />
        <PTextInput
          label="Organization"
          onChangeText={(val: string) => setOrganization(val)}
          text={organization}
          labelTextStyle={styles.label}
        />
        <PTextInput
          label="Job Title / Role"
          onChangeText={(val: string) => setPosition(val)}
          text={position}
          labelTextStyle={styles.label}
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
      </PAppContainer>
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
