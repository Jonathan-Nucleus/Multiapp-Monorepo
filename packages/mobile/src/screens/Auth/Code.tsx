import React, { useState } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTitle from '../../components/common/PTitle';
import PTextInput from '../../components/common/PTextInput';
import { BGDARK, PRIMARY, WHITE } from 'shared/src/colors';
import PGradientButton from '../../components/common/PGradientButton';
import { Body2 } from '../../theme/fonts';
import PTextLine from '../../components/common/PTextLine';
import LogoSvg from '../../assets/icons/logo.svg';

const CodeView = ({ navigation }) => {
  const [code, setCode] = useState('');

  const handleNextPage = () => {
    Keyboard.dismiss();
    navigation.navigate('Signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <PHeader centerIcon={<LogoSvg />} />
      <PAppContainer>
        <PTitle title="Join the inner circle!" />
        <PTextInput
          label="Enter Code"
          onChangeText={(val: string) => setCode(val)}
          text={code}
          onSubmitEditing={handleNextPage}
          autoFocus={true}
          containerStyle={styles.textContainer}
          textInputStyle={styles.textInput}
        />
        <PGradientButton
          label="next"
          btnContainer={styles.btnContainer}
          onPress={handleNextPage}
        />
        <View style={styles.wrap}>
          <Text style={styles.txt}>Already here? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.hyperText}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottom}>
          <PTextLine title="OR" />
          <Text style={styles.invite}>request an invite</Text>
        </View>
      </PAppContainer>
    </SafeAreaView>
  );
};

export default CodeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGDARK,
  },
  textContainer: {
    marginTop: 17,
  },
  textInput: {
    borderRadius: 16,
    height: 56,
    fontSize: 24,
    paddingHorizontal: 12,
  },
  btnContainer: {
    marginTop: 4,
  },
  bottom: {
    marginTop: 106,
  },
  invite: {
    color: PRIMARY,
    ...Body2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 25,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  hyperText: {
    ...Body2,
    color: PRIMARY,
  },
  txt: {
    ...Body2,
    color: WHITE,
  },
});
