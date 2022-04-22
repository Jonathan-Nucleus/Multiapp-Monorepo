import React, { FC, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { CaretLeft, Check } from 'phosphor-react-native';
import { WHITE, BLUE300, PINK } from 'shared/src/colors';
import Share from 'react-native-share';

import pStyles from '../../../theme/pStyles';
import {
  Body1,
  Body1Bold,
  Body2,
  Body2Bold,
  Body3,
} from '../../../theme/fonts';
import PAppContainer from '../../../components/common/PAppContainer';
import MainHeader from '../../../components/main/Header';
import PGradientButton from '../../../components/common/PGradientButton';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const InviteFriends: FC<RouterProps> = ({ navigation }) => {
  const [code, setCode] = useState<number[]>([]);

  const shareCode = () => {
    Share.open({
      title: 'Join me on Prometheus Alts!',
      message: `Share code ${code.join('')}`,
      url: 'prometheusalts.com',
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };

  console.log('code======>', code);

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader
        onPressLeft={() => navigation.goBack()}
        leftIcon={
          <View style={styles.row}>
            <View style={styles.backIcon}>
              <CaretLeft size={28} color={WHITE} />
            </View>
            <Text style={styles.headerTitle}>Invite Friends</Text>
          </View>
        }
      />
      <PAppContainer>
        <Text style={styles.description}>
          The power of Prometheus ratchets up with every intelligent, curious,
          thoughtful new voice in the conversation. So bring in a few contacts
          who'll bring their A-game. You’ll be their first contact.
        </Text>
        <Text style={styles.body1}>You have 10 invites left!</Text>
        <Text style={styles.body2}>Each code can only be used once.</Text>
        <View style={styles.codeContainer}>
          {[1, 2, 3, 4, 5].map((v) => (
            <TouchableOpacity
              key={`key_${v}`}
              onPress={() => setCode([...code, v])}
              disabled={code.includes(v)}>
              <View style={styles.codeWrap}>
                {code.includes(v) ? (
                  <Check size={14} color={WHITE} />
                ) : (
                  <Text style={styles.code}>{v}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.codeContainer}>
          {[6, 7, 8, 9, 10].map((v) => (
            <TouchableOpacity
              key={`key_${v}`}
              onPress={() => setCode([...code, v])}
              disabled={code.includes(v)}>
              <View style={styles.codeWrap}>
                {code.includes(v) ? (
                  <Check size={14} color={WHITE} />
                ) : (
                  <Text style={styles.code}>{v}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <PGradientButton
          onPress={shareCode}
          label="Share a Code"
          btnContainer={styles.btn}
        />
      </PAppContainer>
    </View>
  );
};

export default InviteFriends;

const styles = StyleSheet.create({
  headerTitle: {
    ...Body1,
    color: WHITE,
  },
  description: {
    ...Body2,
    color: WHITE,
    marginTop: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    backgroundColor: BLUE300,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 8,
  },
  body1: {
    ...Body1Bold,
    marginVertical: 12,
    color: WHITE,
  },
  body2: {
    ...Body2Bold,
    color: WHITE,
    marginBottom: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codeWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PINK,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  code: {
    color: WHITE,
    ...Body2Bold,
  },
  btn: {
    marginTop: 35,
  },
});
