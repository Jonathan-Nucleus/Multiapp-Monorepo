import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PLabel from 'mobile/src/components/common/PLabel';
import AccreditationHeader from './AccreditationHeader';
import pStyles from 'mobile/src/theme/pStyles';
import { BGDARK300 } from 'shared/src/colors';
import { H6Bold } from 'mobile/src/theme/fonts';

import {
  InvestorClassOptions,
  InvestorClass as InvestorClassType,
} from 'backend/graphql/enumerations.graphql';

import { InvestorClassScreen } from 'mobile/src/navigations/AccreditationStack';

const InvestorClass: InvestorClassScreen = ({ navigation }) => {
  const next = (investorClass: InvestorClassType): void => {
    navigation.navigate('FormCRS', {
      investorClass: investorClass,
    });
  };

  return (
    <View style={pStyles.globalContainer}>
      <AccreditationHeader
        centerLabel="Investor Accreditation"
        handleBack={() => navigation.goBack()}
      />
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <View style={styles.container}>
          <PLabel
            label="Are you Investing as an:"
            textStyle={styles.titleLabel}
          />
          {InvestorClassOptions.map((item) => {
            const { label, value } = item;
            return (
              <Pressable
                style={({ pressed }) => [
                  styles.greyButton,
                  pressed ? pStyles.pressedStyle : null,
                ]}
                key={value}
                onPress={() => next(value)}>
                <PLabel label={label} />
              </Pressable>
            );
          })}
        </View>
        <View style={styles.bottomContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed ? pStyles.pressedStyle : null,
            ]}
            onPress={() => navigation.goBack()}>
            <PLabel label="Cancel" />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default InvestorClass;

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
    marginBottom: 8,
    marginTop: 24,
  },
  greyButton: {
    backgroundColor: BGDARK300,
    borderRadius: 7,
    height: 48,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 80,
  },
  cancelButton: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
