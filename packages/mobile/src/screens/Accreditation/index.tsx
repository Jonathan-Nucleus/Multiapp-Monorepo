import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import { showMessage } from 'mobile/src/services/utils';
import { SOMETHING_WRONG } from 'shared/src/constants';
import pStyles from 'mobile/src/theme/pStyles';
import { GRAY600, PRIMARYSTATE } from 'shared/src/colors';
import { appWidth } from 'mobile/src/utils/utils';

import AccreditationHeader from './AccreditationHeader';
import AccreditationItem from './AccreditationItem';
import {
  useSaveQuestionnaire,
  FinancialStatus,
  InvestmentLevel,
  InvestorClass,
} from 'mobile/src/graphql/mutation/account/useSaveQuestionnaire';

const slideData = [1, 2, 3, 4];

import { AccreditationScreen } from 'mobile/src/navigations/AppNavigator';

const Accreditation: AccreditationScreen = ({ navigation }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [investOption, setInvestOption] = useState<InvestorClass | undefined>(
    undefined,
  );
  const [financialOptions, setFinancialOptions] = useState<FinancialStatus[]>(
    [],
  );
  const slideRef = useRef<Carousel<number> | null>(null);

  const [saveQuestionnaire] = useSaveQuestionnaire();

  const handleGoNext = () => {
    slideRef?.current?.snapToNext();
  };

  const handleGoBack = () => {
    slideRef?.current?.snapToPrev();
  };

  const saveAccreditation = async (level?: InvestmentLevel) => {
    if (!investOption) return;

    try {
      const { data } = await saveQuestionnaire({
        variables: {
          questionnaire: {
            class: investOption,
            status: financialOptions,
            level: level,
            date: new Date(),
          },
        },
      });

      if (data?.saveQuestionnaire._id) {
        navigation.navigate('AccreditationResult');
      } else {
        showMessage('error', SOMETHING_WRONG);
      }
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const renderPagination = () => {
    return (
      <View style={styles.pageControl}>
        <Pagination
          dotsLength={slideData.length}
          activeDotIndex={activeSlide}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.dotStyle}
          inactiveDotStyle={styles.inactiveDotStyle}
          inactiveDotOpacity={1}
          inactiveDotScale={0.9}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <AccreditationHeader
        centerLabel="Investor Accreditation"
        handleBack={() => navigation.goBack()}
      />
      <PAppContainer noScroll style={styles.container}>
        <Carousel
          ref={slideRef}
          data={slideData}
          sliderWidth={appWidth}
          // sliderHeight={appHeight}
          activeSlideOffset={20}
          itemWidth={appWidth}
          // itemHeight={appHeight}
          scrollEnabled={false}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          onSnapToItem={(index: number) => setActiveSlide(index)}
          renderItem={({ index }) => (
            <AccreditationItem
              index={index}
              isEnoughInvestor={financialOptions.length > 0}
              handleGoNext={handleGoNext}
              handleGoBack={handleGoBack}
              updateInvestOption={(option) => {
                setInvestOption(option);
                handleGoNext();
              }}
              updateFinancialOption={(option) => {
                setFinancialOptions(option);
                handleGoNext();
              }}
              updateInvestmentLevelOption={(level) => saveAccreditation(level)}
            />
          )}
        />
        {renderPagination()}
      </PAppContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  pageControl: {
    position: 'absolute',
    bottom: 88,
    alignSelf: 'center',
  },
  paginationContainer: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARYSTATE,
  },
  inactiveDotStyle: {
    backgroundColor: GRAY600,
  },
});

export default Accreditation;
