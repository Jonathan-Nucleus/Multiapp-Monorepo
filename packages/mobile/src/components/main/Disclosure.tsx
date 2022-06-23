import React, { FC } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  Linking,
} from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';
import { X } from 'phosphor-react-native';
import pStyles from 'mobile/src/theme/pStyles';

import { WHITE, BLACK, PRIMARY } from 'shared/src/colors';
import { Body1Bold, Body2 } from 'mobile/src/theme/fonts';

interface DisclosureProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const Disclosure: FC<DisclosureProps> = (props) => {
  const { onDismiss } = props;
  const showDisclosures = (): void => {
    Linking.openURL(
      'https://www.prometheusalts.com/legals/important-disclosure',
    );
  };
  const showFormADV = (): void => {
    Linking.openURL('https://www.prometheusalts.com/legals/form-adv-part-2a');
  };
  const showFINRA = (): void => {
    Linking.openURL('https://www.finra.org/');
  };
  const showSIPC = (): void => {
    Linking.openURL('https://www.sipc.org/');
  };
  const showBrokerage = (): void => {
    Linking.openURL(
      'https://www.prometheusalts.com/brokeragerelationshipsummary.html',
    );
  };
  const showLibrary = (): void => {
    Linking.openURL('https://www.prometheusalts.com/legals/disclosure-library');
  };
  const showDefinitions = (): void => {
    Linking.openURL(
      'https://help.prometheusalts.com/hc/en-us/articles/4414447421851-Glossary-Terms',
    );
  };

  return (
    <Modal {...props} backdropOpacity={1}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.container, styles.flex]}>
          <View style={styles.header}>
            <Text style={styles.title}>Disclosures</Text>
            <Pressable
              onPress={onDismiss}
              style={({ pressed }) => [
                styles.close,
                pressed ? pStyles.pressedStyle : null,
              ]}>
              <X color={WHITE} size={24} />
            </Pressable>
          </View>
          <ScrollView style={styles.flex}>
            <Text style={[styles.text, styles.white]}>
              Content provided is for educational purposes only. All investments
              involve risk, including the possible loss of capital. Private
              placements, also referred to as alternative investments, are
              complex, speculative, illiquid and carry a high degree of risk,
              including the potential loss of your entire investment and are not
              suitable for all investors. View our{' '}
              <Text style={styles.link} onPress={showDisclosures}>
                Important Disclosure
              </Text>{' '}
              for additional disclosures and information.
              {'\n'}
              {'\n'}
              Prometheus means Prometheus Alternative Investments, Inc., and its
              in-application and web experiences with its family of wholly owned
              subsidiaries, which includes Prometheus Financial, LLC, Prometheus
              Financial Advisors, LLC, Prometheus Access Administrator, LLC and
              Studio Prometheus, LLC.
              {'\n'}
              {'\n'}
              The Marketplace and investment opportunities offered by Prometheus
              Financial Advisors, LLC, a Registered Investment Advisor (RIA).
              See Prometheus Financial Advisors, LLC’s{' '}
              <Text style={styles.link} onPress={showFormADV}>
                Form ADV Part 2A
              </Text>{' '}
              for more information regarding the RIA. Securities products and
              services offered are private placements only sold to accredited
              investors.
              {'\n'}
              {'\n'}
              Securities transactions executed by Prometheus Financial, LLC, a
              registered broker-dealer, member{' '}
              <Text style={styles.link} onPress={showFINRA}>
                FINRA
              </Text>
              /
              <Text style={styles.link} onPress={showSIPC}>
                SIPC
              </Text>
              . See Prometheus Financial, LLC’s{' '}
              <Text style={styles.link} onPress={showBrokerage}>
                Brokerage Form CRS Relationship Summary
              </Text>{' '}
              for a summary of the types of services the broker dealer provides
              and what they cost.
              {'\n'}
              {'\n'}
              You can access all our disclosures in our{' '}
              <Text style={styles.link} onPress={showLibrary}>
                Disclosure Library
              </Text>
              . Click{' '}
              <Text style={styles.link} onPress={showDefinitions}>
                here
              </Text>{' '}
              for definitions and acronyms of financial terminology you may
              encounter in our content.
            </Text>
          </ScrollView>
          <Pressable
            onPress={onDismiss}
            style={({ pressed }) => [
              styles.bottomClose,
              pressed ? pStyles.pressedStyle : null,
            ]}>
            <Text style={styles.white}>Close</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default Disclosure;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: 16,
    backgroundColor: BLACK,
  },
  header: {
    flexDirection: 'row',
    justifyContents: 'center',
    position: 'relative',
    marginBottom: 32,
  },
  title: {
    color: WHITE,
    width: '100%',
    textAlign: 'center',
    ...Body1Bold,
  },
  text: {
    flex: 1,
    lineHeight: 20,
    ...Body2,
  },
  white: {
    color: WHITE,
  },
  link: {
    color: PRIMARY,
  },
  close: {
    position: 'absolute',
    top: -6,
    right: 0,
  },
  bottomClose: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
  },
});
