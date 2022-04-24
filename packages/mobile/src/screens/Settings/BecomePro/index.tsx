import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@apollo/client';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import RNPickerSelect from 'react-native-picker-select';

import PAppContainer from '../../../components/common/PAppContainer';
import PTitle from '../../../components/common/PTitle';
import PTextInput from '../../../components/common/PTextInput';
import PGradientButton from '../../../components/common/PGradientButton';
import ErrorText from '../../../components/common/ErrorTxt';
import {
  Body2,
  Body1,
  H6Bold,
  Body1Bold,
  Body2Bold,
} from '../../../theme/fonts';
import {
  BLACK,
  PRIMARY,
  WHITE,
  BLUE200,
  SUCCESS,
  GRAY800,
  GRAY700,
} from 'shared/src/colors';
import MainHeader from '../../../components/main/Header';
import { CaretLeft, ShieldCheck, CaretDown } from 'phosphor-react-native';
import PFormLabel from '../../../components/common/PFormLabel';

interface BecomeProProps {
  navigation: NavigationProp<ParamListBase>;
}

const DATA = [
  { label: 'Fund Manager', value: 'manager' },
  { label: 'Journalist', value: 'journalist' },
  { label: 'C level manager', value: 'cManager' },
  { label: 'Founder', value: 'founder' },
  { label: 'Ex fund manager', value: 'exManager' },
  { label: 'Other', value: 'other' },
];

const BecomePro: React.FC<BecomeProProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const [info, setInfo] = useState('');
  const [organization, setOrganization] = useState('');

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const handleNextPage = async () => {
    Keyboard.dismiss();
    /*try {
    } catch (err as Error) {
      console.error('login error', e);
      setError(e.message);
    }*/
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
          onValueChange={(val) => setPosition(val)}
          items={DATA}
          value={position}
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
          onChangeText={(val: string) => setRole(val)}
          text={role}
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