import React from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import { CircleWavy } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PLabel from 'mobile/src/components/common/PLabel';
import PText from 'mobile/src/components/common/PText';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import AccreditationHeader from './AccreditationHeader';
import pStyles from 'mobile/src/theme/pStyles';
import { Body2, Body3, H6Bold } from 'mobile/src/theme/fonts';
import { GRAY100, GRAY600, GRAY800, PRIMARY } from 'shared/src/colors';

import { FormCRSScreen } from 'mobile/src/navigations/AccreditationStack';

const FormCRS: FormCRSScreen = ({ navigation, route }) => {
  const { investorClass } = route.params;
  const handleAcknowldge = (): void => {
    if (investorClass === 'ADVISOR') {
      navigation.navigate('FAIntake', {
        ackCRS: true,
      });
    } else {
      navigation.navigate('BaseFinancialStatus', {
        ackCRS: true,
        investorClass: investorClass,
      });
    }
  };

  const goToADV = (): void => {
    Linking.openURL('https://prometheusalts.com/legals/form-adv-part-2a');
  };

  const goToCRS = (): void => {
    Linking.openURL(
      'https://prometheusalts.com/legals/brokerage-form-crs-relationship-summary',
    );
  };

  return (
    <View style={pStyles.globalContainer}>
      <AccreditationHeader
        centerLabel="Investor Accreditation"
        handleBack={() => navigation.goBack()}
      />
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <PAppContainer style={styles.container}>
          <PLabel
            label="Please acknowledge you have reviewed the following forms:"
            textStyle={styles.titleLabel}
          />
          <PText onPress={goToADV} style={styles.link}>
            Prometheus Financial Advisors, LLC Form ADV Part 2A
          </PText>
          <PText onPress={goToCRS} style={styles.link}>
            Prometheus Financial, LLC Brokerage Form CRS Relationship Summary
          </PText>
          <PGradientButton
            label="I Acknowledge"
            onPress={handleAcknowldge}
            btnContainer={styles.acknowledgeBtn}
            gradientContainer={styles.btn}
            textStyle={styles.acknowledgeText}
          />
          <View style={styles.badge}>
            <CircleWavy color={GRAY800} size={140} weight="fill" />
            <View style={styles.badgeTextContainer}>
              <PText style={styles.badgeText}>
                {investorClass === 'ADVISOR' ? 'FA' : 'AI'}
              </PText>
            </View>
          </View>
          <PText style={styles.disclaimer}>
            The Marketplace and investment opportunities offered by Prometheus
            Financial Advisors, LLC, a registered investment advisor (RIA).
            Securities transactions executed by Prometheus Financial, LLC, a
            registered broker-dealer and member FINRA/SIPC. Securities products
            and services offered are private placements only sold to accredited
            investors.
            {'\n\n'}
            By clicking &quot;I Acknowledge&quot; you are acknowledging that you
            have received and reviewed the Prometheus Financial Advisors, LLC
            Form ADV Part 2A (information regarding the RIA) and the Prometheus
            Financial, LLC Brokerage Form CRS Relationship Summary (summarizes
            the types of services the broker dealer provides and what they cost)
          </PText>
        </PAppContainer>
      </SafeAreaView>
    </View>
  );
};

export default FormCRS;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleLabel: {
    ...H6Bold,
    lineHeight: 24,
    marginBottom: 16,
    marginTop: 24,
  },
  link: {
    color: PRIMARY,
    marginBottom: 8,
    ...Body2,
  },
  badge: {
    alignItems: 'center',
    marginVertical: 40,
  },
  badgeTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  badgeText: {
    color: GRAY100,
    fontSize: 40,
    fontWeight: '800',
  },
  btn: {
    height: 48,
  },
  acknowledgeBtn: {
    marginTop: 32,
  },
  acknowledgeText: {
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  disclaimer: {
    color: GRAY600,
    ...Body3,
    lineHeight: 16,
  },
});
