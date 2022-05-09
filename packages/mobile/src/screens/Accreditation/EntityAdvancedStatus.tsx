import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Buildings, UserCircle, Users } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PLabel from 'mobile/src/components/common/PLabel';
import CheckboxLabel from 'mobile/src/components/common/CheckboxLabel';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import AccreditationHeader from './AccreditationHeader';
import { showMessage } from 'mobile/src/services/utils';
import pStyles from 'mobile/src/theme/pStyles';
import { Body1Bold, Body2, Body2Bold, H6Bold } from 'mobile/src/theme/fonts';
import {
  BGDARK,
  BLACK,
  GRAY100,
  PRIMARYSOLID,
  PRIMARYSOLID7,
  WHITE,
  WHITE60,
} from 'shared/src/colors';

import { useSaveQuestionnaire } from 'mobile/src/graphql/mutation/account/useSaveQuestionnaire';
import {
  FinancialStatusOptions,
  AdvancedFinancialStatusData,
  FinancialStatus,
  InvestorClass,
} from 'backend/graphql/enumerations.graphql';

import { EntityAdvancedStatusScreen } from 'mobile/src/navigations/AccreditationStack';
import { SOMETHING_WRONG } from 'shared/src/constants';

const EntityAdvancedStatus: EntityAdvancedStatusScreen = ({
  navigation,
  route,
}) => {
  const { investorClass, baseStatus } = route.params;
  const [selected, setSelected] = useState<FinancialStatus[]>([]);
  const [saveQuestionnaire] = useSaveQuestionnaire();

  const data = AdvancedFinancialStatusData[investorClass];
  const handleChange = (categoryIndex: number): void => {
    let newSelection = [...selected];

    const index = newSelection.indexOf(data[categoryIndex].value);
    index >= 0
      ? newSelection.splice(index, 1)
      : newSelection.push(data[categoryIndex].value);

    setSelected(newSelection);
  };

  const onSubmit = async () => {
    try {
      const { data } = await saveQuestionnaire({
        variables: {
          questionnaire: {
            class: investorClass,
            status: [...baseStatus, ...selected],
            date: new Date(),
          },
        },
      });

      data?.saveQuestionnaire?.accreditation
        ? navigation.push('AccreditationResult', {
            accreditation: data.saveQuestionnaire.accreditation,
            baseStatus,
            investorClass,
          })
        : showMessage('error', SOMETHING_WRONG);
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const goBack = () => navigation.goBack();

  return (
    <View style={pStyles.globalContainer}>
      <AccreditationHeader
        centerLabel="Investor Accreditation"
        handleBack={goBack}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <PLabel label="Are you a QC/QP?" textStyle={styles.titleLabel} />
        <PLabel
          label={`Some funds on Prometheus are only available to Qualified Purchasers or Qualified Clients.

To find out if you qualify, complete the short questionnaire below.`}
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

export default EntityAdvancedStatus;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
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
    backgroundColor: BGDARK,
    borderRadius: 7,
    height: 48,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkContainer: {
    backgroundColor: BGDARK,
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
