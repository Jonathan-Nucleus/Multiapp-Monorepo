import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PLabel from 'mobile/src/components/common/PLabel';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import PGradientOutlineButton from 'mobile/src/components/common/PGradientOutlineButton';
import QPSvg from 'shared/assets/images/QP.svg';
import QCSvg from 'shared/assets/images/QC.svg';
import AISvg from 'shared/assets/images/AI.svg';
import FASvg from 'shared/assets/images/FA.svg';
import pStyles from 'mobile/src/theme/pStyles';
import { GRAY100 } from 'shared/src/colors';
import { Body2, H6Bold } from 'mobile/src/theme/fonts';

import AccreditationHeader from './AccreditationHeader';
import { AccreditationResultScreen } from 'mobile/src/navigations/AccreditationStack';

const RESPONSES = {
  ACCREDITED: {
    icon: <AISvg />,
    title: "You're an accredited investor!",
    subtitle:
      'Thank you for providing the information required by law to ' +
      'verify your status as an accredited investor.',
  },
  QUALIFIED_CLIENT: {
    icon: <QCSvg />,
    title: "You're a qualified client!",
    subtitle: 'Thank you for verifying your qualified client status.',
  },
  QUALIFIED_PURCHASER: {
    icon: <QPSvg />,
    title: 'You’re a qualified purchaser!',
    subtitle: 'Thank you for verifying your qualified purchaser status.',
  },
  ADVISOR: {
    icon: <FASvg />,
    title: 'Thank you!',
    subtitle: 'A member of our Wealth Management team will contact you.',
  },
  NONE: {
    icon: null,
    title: 'Sorry!',
    subtitle:
      'At this time, you do not meet the legal definition of an ' +
      'Accredited Investor.',
  },
} as const;

const AccreditationResult: AccreditationResultScreen = ({
  navigation,
  route,
}) => {
  const { ackCRS, accreditation, baseStatus, investorClass, nextRoute } =
    route.params;
  const { icon, title, subtitle } =
    investorClass === 'ADVISOR' ? RESPONSES.ADVISOR : RESPONSES[accreditation];

  const next = (): void => {
    if (!nextRoute || investorClass === 'ADVISOR') {
      return;
    }
    if (nextRoute === 'IndividualAdvancedStatus') {
      navigation.navigate(nextRoute, {
        ackCRS,
        investorClass,
        baseStatus,
      });
    } else {
      navigation.navigate(nextRoute, {
        ackCRS,
        investorClass,
        baseStatus,
      });
    }
  };

  return (
    <View style={pStyles.globalContainer}>
      <AccreditationHeader
        centerLabel="Investor Accreditation"
        handleBack={() => navigation.pop(2)}
      />
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <PAppContainer noScroll style={styles.container}>
          <View style={[styles.flex, styles.container]}>
            {icon}
            <PLabel label={title} textStyle={styles.titleLabel} />
            <PLabel label={subtitle} textStyle={styles.descriptionLabel} />
          </View>
          <View style={styles.bottomContainer}>
            {nextRoute ? (
              <PGradientButton
                label="Next"
                textStyle={styles.nextButtonLabel}
                btnContainer={styles.btn}
                onPress={next}
              />
            ) : (
              <PGradientOutlineButton
                label="Back to App"
                onPress={() => navigation.navigate('Main')}
                btnContainerStyle={styles.btn}
              />
            )}
          </View>
        </PAppContainer>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
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
    ...Body2,
  },
  btn: {
    flex: 1,
  },
  nextButtonLabel: {
    textTransform: 'none',
  },
  bottomContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 80,
  },
});

export default AccreditationResult;
