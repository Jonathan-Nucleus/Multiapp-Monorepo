import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PLabel from 'mobile/src/components/common/PLabel';
import CheckboxLabel from 'mobile/src/components/common/CheckboxLabel';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import AccreditationHeader from './AccreditationHeader';
import pStyles from 'mobile/src/theme/pStyles';
import { Body2, Body2Bold, H6Bold } from 'mobile/src/theme/fonts';
import { BGDARK300, GRAY100 } from 'shared/src/colors';

import {
  BaseFinancialStatusData,
  FinancialStatus,
} from 'backend/graphql/enumerations.graphql';

import { BaseFinancialStatusScreen } from 'mobile/src/navigations/AccreditationStack';

const BaseFinancialStatus: BaseFinancialStatusScreen = ({
  navigation,
  route,
}) => {
  const { investorClass, ackCRS } = route.params;
  const [selected, setSelected] = useState<FinancialStatus[]>([]);

  const data = BaseFinancialStatusData[investorClass];
  const handleChange = (categoryIndex: number): void => {
    const newSelection = [...selected];

    const index = newSelection.indexOf(data[categoryIndex].value);
    index >= 0
      ? newSelection.splice(index, 1)
      : newSelection.push(data[categoryIndex].value);

    setSelected(newSelection);
  };

  const onSubmit = (): void => {
    const accreditation = selected.length === 0 ? 'NONE' : 'ACCREDITED';
    const nextRoute =
      accreditation === 'NONE'
        ? undefined
        : investorClass === 'INDIVIDUAL'
        ? 'IndividualAdvancedStatus'
        : 'EntityAdvancedStatus';

    navigation.navigate('AccreditationResult', {
      ackCRS,
      investorClass,
      baseStatus: selected,
      accreditation,
      nextRoute,
    });
  };

  const goBack = (): void => navigation.goBack();

  return (
    <View style={pStyles.globalContainer}>
      <AccreditationHeader
        centerLabel="Investor Accreditation"
        handleBack={goBack}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <PLabel
          label="Are you an accredited investor?"
          textStyle={styles.titleLabel}
        />
        <PLabel
          label="As a business regulated by the SEC, this will determine which investments you may be eligible to participate in."
          textStyle={styles.descriptionLabel}
        />
        <PLabel label="Select all that apply:" textStyle={Body2Bold} />
        <View style={styles.financialListContainer}>
          {data.map((item, index) => (
            <CheckboxLabel
              key={item.value}
              id={index}
              category={`${item.title}: ${item.description}`}
              value={selected.includes(item.value)}
              handleChange={handleChange}
              viewStyle={styles.checkContainer}>
              <Text style={styles.financialItemTitle}>
                {item.title}
                {': '}
                <Text style={styles.financialItemDescription}>
                  {item.description}
                </Text>
              </Text>
            </CheckboxLabel>
          ))}
          <Pressable
            style={({ pressed }) => [
              styles.greyButton,
              pressed ? pStyles.pressedStyle : null,
            ]}
            onPress={() => setSelected([])}>
            <PLabel label="None of the above" />
          </Pressable>
        </View>
        <View style={styles.bottomContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed ? pStyles.pressedStyle : null,
            ]}
            onPress={goBack}>
            <PLabel label="Back" />
          </Pressable>
          <PGradientButton
            label="Next"
            textStyle={styles.nextButtonLabel}
            btnContainer={styles.nextButton}
            onPress={onSubmit}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default BaseFinancialStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  titleLabel: {
    ...H6Bold,
    marginBottom: 8,
  },
  descriptionLabel: {
    color: GRAY100,
    marginBottom: 16,
  },
  greyButton: {
    backgroundColor: BGDARK300,
    borderRadius: 7,
    height: 48,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkContainer: {
    backgroundColor: BGDARK300,
    borderRadius: 8,
    borderWidth: 0,
    paddingVertical: 16,
    paddingHorizontal: 28,
    width: '100%',
    height: undefined,
  },
  financialListContainer: {
    marginTop: 16,
    flex: 1,
  },
  financialItemTitle: {
    color: 'white',
    ...Body2Bold,
    marginLeft: 12,
  },
  financialItemDescription: {
    color: 'white',
    ...Body2,
  },
  bottomContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 80,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  nextButtonLabel: {
    textTransform: 'none',
  },
  nextButton: {
    flex: 2,
  },
});
