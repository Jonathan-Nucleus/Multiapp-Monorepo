import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { CaretLeft, PhoneCall, Envelope } from 'phosphor-react-native';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PTitle from 'mobile/src/components/common/PTitle';
import { Body2, H6Bold } from 'mobile/src/theme/fonts';
import { BLACK, WHITE, GRAY700, GRAY600 } from 'shared/src/colors';
import MainHeader from 'mobile/src/components/main/Header';
import PhoneContact from './PhoneContact';
import EmailContact from './EmailContact';

interface ContactProps {
  navigation: NavigationProp<ParamListBase>;
}

const Contact: React.FC<ContactProps> = ({ navigation }) => {
  const [selectTab, setSelectTab] = useState('phone');

  return (
    <View style={styles.container}>
      <MainHeader
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        onPressLeft={() => navigation.goBack()}
      />
      <PAppContainer>
        <PTitle
          title="Choose a contact method:"
          style={styles.textContainer}
          textStyle={styles.title}
        />
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setSelectTab('phone')}>
            <View
              style={[
                styles.phoneTab,
                selectTab === 'phone' && styles.selectedTab,
              ]}>
              <PhoneCall
                size={18}
                color={selectTab === 'phone' ? BLACK : WHITE}
              />
              <Text
                style={[
                  styles.text,
                  selectTab === 'phone' && styles.selectedTxt,
                ]}>
                Phone
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectTab('email')}>
            <View
              style={[
                styles.emailTab,
                selectTab === 'email' && styles.selectedTab,
              ]}>
              <Envelope
                size={18}
                color={selectTab === 'email' ? BLACK : WHITE}
              />
              <Text
                style={[
                  styles.text,
                  selectTab === 'email' && styles.selectedTxt,
                ]}>
                Email
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {selectTab === 'phone' ? <PhoneContact /> : <EmailContact />}
      </PAppContainer>
    </View>
  );
};

export default Contact;

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
  tabContainer: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    marginBottom: 32,
  },
  phoneTab: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    borderColor: GRAY600,
    borderWidth: 1,
    width: Dimensions.get('screen').width / 2 - 16,
    flexDirection: 'row',
  },
  emailTab: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    borderColor: GRAY600,
    borderWidth: 1,
    width: Dimensions.get('screen').width / 2 - 16,
    flexDirection: 'row',
  },
  selectedTab: {
    backgroundColor: WHITE,
  },
  text: {
    ...Body2,
    color: WHITE,
    marginLeft: 6,
  },
  selectedTxt: {
    color: BLACK,
  },
});
