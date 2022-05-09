import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  ListRenderItem,
} from 'react-native';
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
import { SOMETHING_WRONG } from 'shared/src/constants';

import { IndividualAdvancedStatusScreen } from 'mobile/src/navigations/AccreditationStack';

const IndividualAdvancedStatus: IndividualAdvancedStatusScreen = ({
  navigation,
  route,
}) => {
  const { investorClass, baseStatus } = route.params;
  const [selected, setSelected] = useState<
    Partial<Record<FinancialStatus, boolean>>
  >({});
  const [saveQuestionnaire] = useSaveQuestionnaire();

  const data = AdvancedFinancialStatusData[investorClass];
  const handleChange = (value: FinancialStatus, state: boolean): void => {
    const newSelection = { ...selected };
    newSelection[value] = state;
    setSelected(newSelection);
  };

  const onSubmit = async () => {
    const trueValues: FinancialStatus[] = [];
    Object.entries(selected).forEach(
      ([key, value]) => value && trueValues.push(key as FinancialStatus),
    );

    try {
      const { data } = await saveQuestionnaire({
        variables: {
          questionnaire: {
            class: investorClass,
            status: [...baseStatus, ...trueValues],
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
        <View style={styles.financialListContainer}>
          {data.map((item, index) => {
            const isSelected = selected[item.value];
            return (
              <View key={item.value}>
                <PLabel label={item.title} textStyle={styles.subtitleLabel} />
                <View style={styles.selectionContainer}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.selectButton,
                      isSelected && styles.selectedButton,
                      pressed ? pStyles.pressedStyle : null,
                    ]}
                    onPress={() => handleChange(item.value, true)}>
                    <PLabel
                      label="Yes"
                      textStyle={isSelected ? styles.selectedLabel : {}}
                    />
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.selectButton,
                      isSelected === false && styles.selectedButton,
                      pressed ? pStyles.pressedStyle : null,
                    ]}
                    onPress={() => handleChange(item.value, false)}>
                    <PLabel
                      label="No"
                      textStyle={
                        isSelected === false ? styles.selectedLabel : {}
                      }
                    />
                  </Pressable>
                </View>
              </View>
            );
          })}
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

export default IndividualAdvancedStatus;

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
  subtitleLabel: {
    ...Body1Bold,
    marginBottom: 8,
    marginTop: 16,
  },
  greyButton: {
    backgroundColor: BGDARK,
    borderRadius: 7,
    height: 48,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  selectButton: {
    backgroundColor: BLACK,
    borderRadius: 24,
    borderColor: WHITE60,
    borderWidth: 1,
    width: '45%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedLabel: {
    color: BLACK,
  },
  selectedButton: {
    backgroundColor: WHITE,
    borderRadius: 24,
    width: '45%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  financialListContainer: {
    marginTop: 16,
    flex: 1,
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
