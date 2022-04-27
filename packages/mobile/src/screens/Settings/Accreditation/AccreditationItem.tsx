import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import PLabel from '../../../components/common/PLabel';
import CheckboxLabel from '../../../components/common/CheckboxLabel';
import PGradientButton from '../../../components/common/PGradientButton';
import * as NavigationService from '../../../services/navigation/NavigationService';

import AISvg from 'shared/assets/images/AI.svg';
import {
  BGDARK,
  BLACK,
  GRAY100,
  PRIMARYSOLID,
  PRIMARYSOLID7,
  WHITE,
  WHITE60,
} from 'shared/src/colors';
import { Body1Bold, Body2Bold, H6Bold } from '../../../theme/fonts';
import { appWidth } from '../../../utils/utils';

interface AccreditationItemProps {
  index: number;
  isEnoughInvestor: boolean;
  handleGoNext: () => void;
  handleGoBack: () => void;
  updateInvestOption: (investOption: string) => void;
  updateFinancialOption: (financialOptions: string) => void;
  updateInvestmentLevelOption: (option: string) => void;
}

const InvestOptions = [
  {
    title: 'Individual',
    value: 'INDIVIDUAL',
  },
  // {
  //   title: 'Entity',
  //   value: 'ENTITY',
  // },
  // {
  //   title: 'Financial Advisor',
  //   value: 'ADVISOR',
  // },
];

interface FinancialStatusProps {
  id: number;
  title: string;
  value: string;
  description: string;
  isChecked: boolean;
}

const FinancialStatusOptions: FinancialStatusProps[] = [
  {
    id: 1,
    isChecked: false,
    title: 'Income',
    value: 'MIN_INCOME',
    description:
      'I earn $200k+ per year or, with my spousal equivalent, $300K+ per year.',
  },
  {
    id: 2,
    isChecked: false,
    title: 'Personal Net Worth',
    value: 'NET_WORTH',
    description: 'I/we have $1M+ in assets excluding primary residence.',
  },
  {
    id: 3,
    isChecked: false,
    title: 'License Holder',
    value: 'LICENSED',
    description:
      'I hold an active Series 7.65, or 82 licencse in good standing',
  },
  {
    id: 4,
    isChecked: false,
    title: 'Affiliation',
    value: 'AFFILIATED',
    description:
      'I am a knowledgeable employee, executive officer, trustee, general partner or advisory board member of a private fund',
  },
];

const AccreditationItem: React.FC<AccreditationItemProps> = ({
  index = 0,
  isEnoughInvestor,
  handleGoNext,
  handleGoBack,
  updateInvestOption,
  updateFinancialOption,
  updateInvestmentLevelOption,
}) => {
  const [financialStatusOptions, setFinancialStatusOptions] = useState<
    FinancialStatusProps[]
  >(FinancialStatusOptions);
  const [investLevel1, setInvestLevel1] = useState('');
  const [investLevel2, setInvestLevel2] = useState('');

  const renderFirstSlide = () => {
    return (
      <View style={styles.container}>
        <PLabel
          label="Are you Investing as an:"
          textStyle={styles.titleLabel}
        />
        {InvestOptions.map((item) => {
          const { title, value } = item;
          return (
            <TouchableOpacity
              style={styles.greyButton}
              key={value}
              onPress={() => updateInvestOption(value)}>
              <PLabel label={title} />
            </TouchableOpacity>
          );
        })}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => NavigationService.goBack()}>
            <PLabel label="Cancel" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleFinancialStatusChange = (id: number) => {
    const temp = financialStatusOptions.map((category) => {
      if (id === category.id) {
        return { ...category, isChecked: !category.isChecked };
      }
      return category;
    });
    setFinancialStatusOptions(temp);
  };

  const renderFinancialStatusItem = ({
    item,
  }: {
    item: FinancialStatusProps;
  }) => (
    <CheckboxLabel
      id={item.id}
      category={`${item.title}: ${item.description}`}
      value={item.isChecked}
      handleChange={handleFinancialStatusChange}
      viewStyle={styles.checkContainer}
    />
  );

  const renderSecondSlide = () => {
    return (
      <View style={styles.container}>
        <PLabel
          label="Are you an accredited investor?"
          textStyle={styles.titleLabel}
        />
        <PLabel
          label="As a business regulated by the SEC, this will determine which investments you may be eligible to participate in."
          textStyle={styles.descriptionLabel}
        />
        <PLabel label="Select all that apply:" textStyle={Body2Bold} />
        <FlatList
          data={FinancialStatusOptions}
          renderItem={renderFinancialStatusItem}
          contentContainerStyle={styles.financialListContainer}
          scrollEnabled={false}
          ListFooterComponent={
            <TouchableOpacity style={styles.greyButton}>
              <PLabel label="None of the above" />
            </TouchableOpacity>
          }
          keyExtractor={(item) => item.id.toString()}
        />
        <View style={styles.secondBottomWrapper}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleGoBack}>
            <PLabel label="Back" />
          </TouchableOpacity>
          <PGradientButton
            label="Next"
            textStyle={styles.nextButtonLabel}
            btnContainer={{ width: '50%' }}
            onPress={() => {
              const checkedItems = financialStatusOptions.filter(
                (item) => item.isChecked,
              );
              if (checkedItems.length > 0) {
                const values = checkedItems.map((item) => item.value);
                updateFinancialOption(values[0]);
              } else {
                updateFinancialOption('');
              }
            }}
          />
        </View>
      </View>
    );
  };

  const renderThirdSlide = () => {
    return (
      <View style={[styles.container, styles.thirdSlide]}>
        {isEnoughInvestor ? (
          <>
            <AISvg />
            <PLabel
              label="You’re an accredited investor!"
              textStyle={styles.titleLabel}
            />
            <PLabel
              label="Thank you for providing the information required by law to verify your status as an accredited investor."
              textStyle={styles.descriptionLabel}
            />
            <View style={styles.bottomContainer}>
              <PGradientButton
                label="Next"
                textStyle={styles.nextButtonLabel}
                btnContainer={{ width: '100%' }}
                onPress={handleGoNext}
              />
            </View>
          </>
        ) : (
          <>
            <PLabel label="Sorry!" textStyle={styles.titleLabel} />
            <PLabel
              label="At this time, you do not meet the legal definition of an Accredited Investor."
              textStyle={styles.descriptionLabel}
            />
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                onPress={() => NavigationService.goBack()}
                style={styles.outlineBtn}>
                <PLabel label="Back to App" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };

  const renderFourthSlide = () => {
    return (
      <View style={styles.container}>
        <PLabel label="Are you a QC/QP?" textStyle={styles.titleLabel} />
        <PLabel
          label="Some funds on Prometheus are only available to Qualified Purchasers or Qualified Clients."
          textStyle={styles.descriptionLabel}
        />
        <PLabel
          label="To find out if you qualify, complete the short questionnaire below:"
          textStyle={styles.descriptionLabel}
        />
        <PLabel
          label="Do you have at least $2.2M in investments?"
          textStyle={styles.subTtitleLabel}
        />
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={[
              styles.selectButton,
              investLevel1 === 'TIER1' && styles.selectedButton,
            ]}
            onPress={() => setInvestLevel1('TIER1')}>
            <PLabel
              label="Yes"
              textStyle={investLevel1 === 'TIER1' ? styles.selectedLabel : {}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              setInvestLevel1('');
              setInvestLevel2('');
            }}>
            <PLabel label="No" />
          </TouchableOpacity>
        </View>
        {investLevel1 === 'TIER1' && (
          <>
            <PLabel
              label="Do you have at least $5M in investments?"
              textStyle={styles.subTtitleLabel}
            />
            <View style={styles.selectionContainer}>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  investLevel2 === 'TIER2' && styles.selectedButton,
                ]}
                onPress={() => setInvestLevel2('TIER2')}>
                <PLabel
                  label="Yes"
                  textStyle={
                    investLevel2 === 'TIER2' ? styles.selectedLabel : {}
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setInvestLevel2('')}>
                <PLabel label="No" />
              </TouchableOpacity>
            </View>
          </>
        )}
        <View style={styles.secondBottomWrapper}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleGoBack}>
            <PLabel label="Back" />
          </TouchableOpacity>
          <PGradientButton
            label="Next"
            textStyle={styles.nextButtonLabel}
            btnContainer={{ width: '50%' }}
            onPress={() =>
              updateInvestmentLevelOption(investLevel2 || investLevel1)
            }
          />
        </View>
      </View>
    );
  };

  return (
    <View>
      {index === 0 && renderFirstSlide()}
      {index === 1 && renderSecondSlide()}
      {index === 2 && renderThirdSlide()}
      {index === 3 && renderFourthSlide()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 16,
    height: '100%',
  },
  thirdSlide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleLabel: {
    ...H6Bold,
    marginBottom: 8,
  },
  subTtitleLabel: {
    ...Body1Bold,
    marginBottom: 8,
    marginTop: 16,
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
  checkContainer: {
    backgroundColor: BGDARK,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 28,
    width: '100%',
    height: undefined,
  },
  financialListContainer: {
    marginTop: 16,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: appWidth,
    position: 'absolute',
    bottom: 0,
    height: 80,
  },
  secondBottomWrapper: {
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: appWidth,
  },
  cancelButton: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
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
  nextButtonLabel: {
    textTransform: 'none',
  },
});

export default AccreditationItem;
