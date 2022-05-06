import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PLabel from 'mobile/src/components/common/PLabel';
import QPSvg from 'shared/assets/images/QP.svg';
import QCSvg from 'shared/assets/images/QC.svg';
import AISvg from 'shared/assets/images/AI.svg';
import pStyles from 'mobile/src/theme/pStyles';
import { GRAY100, PRIMARYSOLID, PRIMARYSOLID7 } from 'shared/src/colors';
import { H6Bold } from 'mobile/src/theme/fonts';

import AccreditationHeader from './AccreditationHeader';
import { AccreditationResultScreen } from 'mobile/src/navigations/AppNavigator';

import { useAccount } from 'mobile/src/graphql/query/account';

const AccreditationResult: AccreditationResultScreen = ({ navigation }) => {
  const { data: accountData } = useAccount();
  const accreditation = accountData?.account?.accreditation;

  let title = '';
  let subtitle = '';

  switch (accreditation) {
    case 'ACCREDITED':
      title = "You're an accredited investor!";
      subtitle =
        'Thank you for providing the information required by law to ' +
        'verify your status as an accredited investor.';
      break;

    case 'QUALIFIED_CLIENT':
      title = "You're a qualified client!";
      subtitle = 'Thank you for verifying your qualified client status.';
      break;

    case 'QUALIFIED_PURCHASER':
      title = 'You’re a qualified purchaser!';
      subtitle = 'Thank you for verifying your qualified purchaser status.';
      break;

    case 'NONE':
  }

  return (
    <View style={pStyles.globalContainer}>
      <AccreditationHeader
        centerLabel="Investor Accreditation"
        handleBack={() => navigation.pop(2)}
      />
      {accreditation && (
        <SafeAreaView style={styles.flex}>
          <PAppContainer noScroll style={styles.container}>
            <View style={[styles.flex, styles.container]}>
              {accreditation === 'QUALIFIED_PURCHASER' ? (
                <QPSvg />
              ) : accreditation === 'QUALIFIED_CLIENT' ? (
                <QCSvg />
              ) : (
                <AISvg />
              )}
              <PLabel label={title} textStyle={styles.titleLabel} />
              <PLabel label={subtitle} textStyle={styles.descriptionLabel} />
            </View>
            <TouchableOpacity
              onPress={() => navigation.pop(2)}
              style={styles.outlineBtn}>
              <PLabel label="Back to App" />
            </TouchableOpacity>
          </PAppContainer>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  titleLabel: {
    ...H6Bold,
    marginTop: 24,
    marginBottom: 8,
  },
  descriptionLabel: {
    color: GRAY100,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 20,
    marginHorizontal: 16,
  },
  outlineBtn: {
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
