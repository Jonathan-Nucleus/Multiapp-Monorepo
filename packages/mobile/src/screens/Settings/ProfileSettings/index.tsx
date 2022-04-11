import React, { FC } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { NavigationProp } from '@react-navigation/native';
import {
  CaretLeft,
  MagnifyingGlass,
  Gear,
  DotsThreeVertical,
} from 'phosphor-react-native';
import {
  WHITE,
  BGDARK,
  PRIMARYSOLID7,
  GRAY100,
  PRIMARY,
  BLACK,
} from 'shared/src/colors';
import LinkedinSvg from 'shared/assets/images/linkedin.svg';
import TwitterSvg from 'shared/assets/images/twitter.svg';

import PHeader from '../../../components/common/PHeader';
import pStyles from '../../../theme/pStyles';
import { Body1, Body2, Body3 } from '../../../theme/fonts';
import PAppContainer from '../../../components/common/PAppContainer';
import PGradientButton from '../../../components/common/PGradientButton';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ProfileSettings: FC<RouterProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PHeader
        containerStyle={styles.headerContainer}
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        rightIcon={<MagnifyingGlass size={28} color={WHITE} />}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => console.log(1231)}
      />
      <PAppContainer style={styles.appContainer}>
        <View style={styles.content}>
          <View style={styles.item}>
            <FastImage
              style={styles.avatar}
              source={{
                uri: 'https://unsplash.it/400/400?image=1',
                headers: { Authorization: 'someAuthToken' },
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.rightItem}>
              <Text style={styles.label}>Enrique Javier Abeyta Ubillos</Text>
              <Text style={styles.comment}>CEO</Text>
              <Text style={styles.comment}>
                National Basketball Association
              </Text>
            </View>
          </View>
          <Text style={styles.comment}>
            Virgin is a leading international investment group and one of the
            world's most recognised and respected brands. Read More...
          </Text>
          <View style={styles.row}>
            <PGradientButton
              label="Edit Profile"
              onPress={() => console.log(11)}
              btnContainer={styles.editProfileBtn}
            />
            <TouchableOpacity>
              <DotsThreeVertical size={28} color={GRAY100} />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={styles.comment}>
              64 Followers | 24 Following | 6 Posts
            </Text>
          </View>
        </View>
        <View style={[styles.row, styles.social]}>
          <TouchableOpacity>
            <LinkedinSvg />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <TwitterSvg />
          </TouchableOpacity>
          <View style={styles.verticalLine} />
          <TouchableOpacity>
            <Text style={styles.website}>Website</Text>
          </TouchableOpacity>
        </View>
      </PAppContainer>
    </SafeAreaView>
  );
};

export default ProfileSettings;

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
  appContainer: {
    paddingHorizontal: 0,
  },
  content: {
    paddingHorizontal: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  rightItem: {
    marginLeft: 8,
  },
  label: {
    ...Body2,
    color: WHITE,
  },
  comment: {
    color: GRAY100,
    ...Body3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  editProfileBtn: {
    flex: 1,
    marginRight: 12,
    width: '100%',
  },
  editProfileTxt: {
    textAlign: 'center',
    color: PRIMARY,
    ...Body2,
  },
  website: {
    color: PRIMARY,
    ...Body3,
  },
  social: {
    paddingVertical: 8,
    borderTopColor: GRAY100,
    borderBottomColor: GRAY100,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    elevation: 5,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.7,
  },
  verticalLine: {
    height: 32,
    backgroundColor: GRAY100,
    width: 1,
    marginLeft: 40,
    marginRight: 20,
  },
  icon: {
    marginLeft: 20,
  },
});
