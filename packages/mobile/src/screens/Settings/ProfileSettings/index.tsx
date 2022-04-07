import React, { FC } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { NavigationProp } from '@react-navigation/native';
import {
  CaretLeft,
  MagnifyingGlass,
  Gear,
  DotsThreeOutlineVertical,
} from 'phosphor-react-native';
import {
  WHITE,
  BGDARK,
  PRIMARYSOLID7,
  GRAY100,
  PRIMARY,
} from 'shared/src/colors';

import PHeader from '../../../components/common/PHeader';
import pStyles from '../../../theme/pStyles';
import { Body1, Body2, Body3 } from '../../../theme/fonts';
import PAppContainer from '../../../components/common/PAppContainer';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ProfileSettings: FC<RouterProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PHeader
        centerIcon={<Text style={styles.headerTitle}>Profile</Text>}
        containerStyle={styles.headerContainer}
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        rightIcon={<MagnifyingGlass size={28} color={WHITE} />}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => console.log(1231)}
      />
      <PAppContainer>
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
            <Text style={styles.comment}>National Basketball Association</Text>
          </View>
        </View>
        <Text style={styles.comment}>
          Virgin is a leading international investment group and one of the
          world's most recognised and respected brands. Read More...
        </Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileTxt}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Gear size={28} color={GRAY100} />
          </TouchableOpacity>
          <TouchableOpacity>
            <DotsThreeOutlineVertical size={28} color={GRAY100} />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Text style={styles.comment}>
            64 Followers | 24 Following | 6 Posts
          </Text>
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
    height: 36,
    borderRadius: 8,
    borderColor: PRIMARY,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  editProfileTxt: {
    textAlign: 'center',
    color: PRIMARY,
    ...Body2,
  },
});
