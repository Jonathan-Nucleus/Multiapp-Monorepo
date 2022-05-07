import React, { FC, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { CaretLeft, Check } from 'phosphor-react-native';
import { WHITE, BLUE300, PINK, GRAY600, PRIMARYSOLID } from 'shared/src/colors';
import Share from 'react-native-share';
import FastImage from 'react-native-fast-image';
import { AVATAR_URL } from 'react-native-dotenv';

import pStyles from 'mobile/src/theme/pStyles';
import {
  Body1,
  Body1Bold,
  Body2,
  Body2Bold,
  Body3,
  H5Bold,
} from 'mobile/src/theme/fonts';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import MainHeader from 'mobile/src/components/main/Header';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import { showMessage } from 'mobile/src/services/utils';
import { useAccount } from 'mobile/src/graphql/query/account';
import User1Svg from 'mobile/src/assets/images/user1.svg';
import User2Svg from 'mobile/src/assets/images/user2.svg';
import User3Svg from 'mobile/src/assets/images/user3.svg';
import LampSvg from 'mobile/src/assets/images/lamp.svg';
import AddSvg from 'mobile/src/assets/images/add.svg';
import Avatar from '../../../../components/common/Avatar';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const InviteFriends: FC<RouterProps> = ({ navigation }) => {
  const [code, setCode] = useState<number[]>([]);
  const { data: userData } = useAccount();
  const account = userData?.account;

  const shareCode = async () => {
    try {
      const result = await Share.open({
        title: 'Join me on Prometheus Alts!',
        // message: `Share code ${code.join('')}`,
        message: 'Share code',
        url: 'prometheusalts.com',
      });

      console.log('result', result);
      showMessage('success', 'Invitation Sent!');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader
        onPressLeft={() => navigation.goBack()}
        leftIcon={
          <View style={styles.row}>
            <CaretLeft size={28} color={WHITE} />
            <Text style={styles.headerTitle}>Invite Friends</Text>
          </View>
        }
      />
      <PAppContainer>
        <View style={styles.avatarSections}>
          <View style={styles.user1}>
            <User1Svg />
          </View>
          <View style={styles.user2}>
            <User2Svg />
          </View>
          <View style={styles.lamp}>
            <LampSvg />
          </View>

          <View style={styles.avatarContainer}>
            <Avatar user={account} size={84} />
          </View>
          <View style={styles.user3}>
            <User3Svg />
          </View>
          <View style={styles.add}>
            <AddSvg />
          </View>
        </View>

        <Text style={styles.description}>
          The power of Prometheus ratchets up with every intelligent, curious,
          thoughtful new voice in the conversation. So bring in a few contacts
          who'll bring their A-game. You’ll be their first contact.
        </Text>
        <Text style={styles.body1}>
          You have {10 - code.length} invites left!
        </Text>
        <Text style={styles.body2}>Each code can only be used once.</Text>
        <View style={styles.codeContainer}>
          {[1, 2, 3, 4, 5].map((v) => (
            <TouchableOpacity
              key={`key_${v}`}
              onPress={() => setCode([...code, v])}
              disabled={code.includes(v)}>
              <View
                style={[
                  styles.codeWrap,
                  code.includes(v) && styles.selectedCode,
                ]}>
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
    marginBottom: 10,
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
  selectedCode: {
    backgroundColor: GRAY600,
  },
  code: {
    color: WHITE,
    ...Body2Bold,
  },
  btn: {
    marginTop: 35,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  noAvatarContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAvatar: {
    color: PRIMARYSOLID,
    ...H5Bold,
    textTransform: 'uppercase',
  },
  avatarSections: {
    marginBottom: 60,
    width: '100%',
  },
  avatarContainer: {
    marginTop: 61,
    alignSelf: 'center',
  },
  user1: {
    position: 'absolute',
    top: 18,
    left: 16,
  },
  user2: {
    position: 'absolute',
    top: 97,
    left: 58,
  },
  lamp: {
    position: 'absolute',
    top: 39,
    left: 90,
  },
  user3: {
    position: 'absolute',
    top: 42,
    right: 62,
  },
  add: {
    position: 'absolute',
    top: 101,
    right: 14,
  },
});
