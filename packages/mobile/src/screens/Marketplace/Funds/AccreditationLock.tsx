import React, { FC } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ListRenderItem,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Presentation } from 'phosphor-react-native';
import { AVATAR_URL, BACKGROUND_URL } from 'react-native-dotenv';

import {
  PRIMARY,
  WHITE,
  SUCCESS,
  DANGER,
  GRAY100,
  WHITE12,
  BLACK,
  BGDARK,
  WHITE60,
} from 'shared/src/colors';
import { Body2Bold, Body3, H6Bold } from 'mobile/src/theme/fonts';
import PGradientButton from '../../../components/common/PGradientButton';
import PTitle from '../../../components/common/PTitle';
import PLabel from '../../../components/common/PLabel';
import * as NavigationService from '../../../services/navigation/NavigationService';

const AccreditationLock: FC = () => {
  return (
    <View style={styles.overviewContainer}>
      <View style={styles.infoContainer}>
        <PLabel
          label="Only verified accredited investors can browse funds."
          viewStyle={styles.labelView}
          textStyle={styles.labelText}
        />
        <PGradientButton
          label="Verify Accreditation Status"
          onPress={() => NavigationService.navigate('Accreditation')}
        />
      </View>
    </View>
  );
};

export default AccreditationLock;

const styles = StyleSheet.create({
  overviewContainer: {
    backgroundColor: BLACK,
    flex: 1,
    justifyContent: 'center',
  },
  infoContainer: {
    paddingHorizontal: 16,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  labelView: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  labelText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
});
