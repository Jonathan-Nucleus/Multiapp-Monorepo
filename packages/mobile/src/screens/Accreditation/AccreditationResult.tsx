import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PLabel from 'mobile/src/components/common/PLabel';
import QPSvg from 'shared/assets/images/QP.svg';
import pStyles from 'mobile/src/theme/pStyles';
import { GRAY100, PRIMARYSOLID, PRIMARYSOLID7 } from 'shared/src/colors';
import { H6Bold } from 'mobile/src/theme/fonts';

import AccreditationHeader from './AccreditationHeader';
import { AccreditationResultScreen } from 'mobile/src/navigations/AppNavigator';

const AccreditationResult: AccreditationResultScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <AccreditationHeader
        centerLabel="Investor Accreditation"
        handleBack={() => navigation.pop(2)}
      />
      <PAppContainer noScroll style={styles.container}>
        <QPSvg />
        <PLabel
          label="You’re a qualified purchaser!"
          textStyle={styles.titleLabel}
        />
        <PLabel
          label="Thank you for verifying your qualified purchaser status."
          textStyle={styles.descriptionLabel}
        />
        <TouchableOpacity
          onPress={() => navigation.pop(2)}
          style={styles.outlineBtn}>
          <PLabel label="Back to App" />
        </TouchableOpacity>
      </PAppContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleLabel: {
    ...H6Bold,
    marginTop: 24,
    marginBottom: 8,
  },
  descriptionLabel: {
    color: GRAY100,
    marginBottom: 16,
  },
  outlineBtn: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    height: 45,
    marginTop: 24,
    borderRadius: 22,
    borderColor: PRIMARYSOLID,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARYSOLID7,
  },
});

export default AccreditationResult;
