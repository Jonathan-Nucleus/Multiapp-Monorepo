import React, { useMemo, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
// import Autocomplete from 'react-native-autocomplete-input';

import PTextInput from 'mobile/src/components/common/PTextInput';
import {
  Body2,
  Body1,
  H6Bold,
  Body1Bold,
  Body2Bold,
} from 'mobile/src/theme/fonts';
import { BLACK, WHITE, GRAY700 } from 'shared/src/colors';
import { CaretDown } from 'phosphor-react-native';
import PFormLabel from 'mobile/src/components/common/PFormLabel';
import PMaskTextInput from 'mobile/src/components/common/PMaskTextInput';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import { PreferredTimeOfDayOptions } from 'backend/schemas/help-request';

const TimeDAY = Object.keys(PreferredTimeOfDayOptions).map((option) => ({
  value: option,
  label: PreferredTimeOfDayOptions[option].label,
}));

interface Fund {
  value: string;
  label: string;
}

interface HelpRequestVariables {
  request: {
    type: string;
    email?: string;
    phone?: string;
    fundId: string;
    message: string;
    preferredTimeOfDay?: string;
  };
}

interface Props {
  handleContact: (request: HelpRequestVariables) => void;
  funds: Fund[];
}

const PhoneContact: React.FC<Props> = ({ handleContact, funds }) => {
  const [phone, setPhone] = useState('');
  const [preTime, setPreTime] = useState('');
  const [interest, setInterest] = useState('');
  const [info, setInfo] = useState('');

  const handleNextPage = () => {
    Keyboard.dismiss();
    handleContact({
      request: {
        type: 'PHONE',
        phone: phone,
        fundId: interest,
        message: info,
        preferredTimeOfDay: preTime,
      },
    });
  };

  const disabled = useMemo(() => {
    if (info && phone && interest && preTime && phone.length === 10) {
      return false;
    }
    return true;
  }, [phone, interest, info, preTime]);

  return (
    <View style={styles.container}>
      <PMaskTextInput
        label="Phone Number"
        onChangeText={(val) => setPhone(val ?? '')}
        text={phone}
        keyboardType="number-pad"
        labelTextStyle={styles.label}
        mask={'([000])-[000]-[0000]'}
      />
      <PFormLabel label="Preferred Time of Day" textStyle={styles.label} />
      <RNPickerSelect
        onValueChange={(val: string) => setPreTime(val)}
        items={TimeDAY}
        value={preTime}
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
      <PFormLabel label="Fund of Interest" textStyle={styles.label} />
      <RNPickerSelect
        onValueChange={(val: string) => setInterest(val)}
        items={funds}
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
          disabled={disabled}
        />
      </View>
    </View>
  );
};

export default PhoneContact;

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
    paddingHorizontal: 8,
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
