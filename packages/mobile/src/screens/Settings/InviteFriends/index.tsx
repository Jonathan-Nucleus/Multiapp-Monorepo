import React, { FC, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { CaretLeft, MagnifyingGlass } from 'phosphor-react-native';
import { WHITE, BGDARK, GRAY1, PRIMARY, BGDARK100 } from 'shared/src/colors';

import PHeader from '../../../components/common/PHeader';
import pStyles from '../../../theme/pStyles';
import { Body1, Body2, Body3 } from '../../../theme/fonts';
import PAppContainer from '../../../components/common/PAppContainer';
import PTextInput from '../../../components/common/PTextInput';
import PLabel from '../../../components/common/PLabel';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const InviteFriends: FC<RouterProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PHeader
        centerIcon={<Text style={styles.headerTitle}>Invite Friends</Text>}
        containerStyle={styles.headerContainer}
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        rightIcon={<MagnifyingGlass size={28} color={WHITE} />}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => console.log(1231)}
      />
      <PAppContainer>
        <View style={styles.container}>
          <PLabel
            viewStyle={styles.titleView}
            textStyle={styles.title}
            label="Invite Your Friends"
          />
          <View style={styles.content}>
            <PTextInput
              label="Email Address to Invite (up to 2 more)"
              keyboardType="email-address"
              onChangeText={(val: string) => setEmail(val)}
              text={email}
            />
            <PLabel
              label="We want to seed this platform with those who really have a passion for financial markets, economics and great ideas."
              textStyle={styles.description}
            />
            <TouchableOpacity>
              <View style={styles.btnView}>
                <PLabel label="invite" textStyle={styles.btnTxt} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </PAppContainer>
    </SafeAreaView>
  );
};

export default InviteFriends;

const styles = StyleSheet.create({
  headerTitle: {
    ...Body1,
    color: WHITE,
  },
  headerContainer: {
    backgroundColor: BGDARK,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    paddingTop: 0,
    marginBottom: 0,
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: BGDARK100,
    elevation: 1,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    borderRadius: 8,
    marginTop: 20,
  },
  content: {
    padding: 20,
  },
  titleView: {
    borderBottomColor: GRAY1,
    borderBottomWidth: 1,
    paddingBottom: 13,
    marginBottom: 17,
    padding: 20,
  },
  title: {
    ...Body1,
  },
  description: {
    ...Body3,
  },
  btnView: {
    backgroundColor: PRIMARY,
    borderRadius: 32,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 9,
    marginTop: 18,
  },
  btnTxt: {
    textTransform: 'uppercase',
  },
});
