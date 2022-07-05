import React, { FC, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Star } from 'phosphor-react-native';

import PGradientOutlineButton from 'mobile/src/components/common/PGradientOutlineButton';
import { navigate } from 'mobile/src/services/navigation/NavigationService';
import { PRIMARYSTATE, WHITE } from 'shared/src/colors';
import {
  FundCompany,
  FundManager,
  FundSummary,
} from 'shared/graphql/fragments/fund';
import FundProfileInfo from './FundProfileInfo';

import { useWatchFund } from 'shared/graphql/mutation/funds/useWatchFund';
import pStyles from '../../../theme/pStyles';
import Tooltip from 'react-native-walkthrough-tooltip';
import { EventRegister } from 'react-native-event-listeners';

export type Fund = FundSummary & FundCompany & FundManager;

export interface FundItemProps {
  fund: Fund;
  showOverview?: boolean;
  showTags?: boolean;
  index: number;
}

const FundItem: FC<FundItemProps> = ({ fund, index }) => {
  const { isWatching, toggleWatch } = useWatchFund(fund._id);
  const [showTutorialBtn, setShowTutorialBtn] = useState(false);
  const [showTutorialForStar, setShowTutorialForStar] = useState(false);

  useEffect(() => {
    EventRegister.addEventListener('tutorialFundItem', () => {
      setShowTutorialBtn(true);
      setShowTutorialForStar(false);
    });
  }, []);

  const goToFund = (): void => {
    navigate('FundDetails', { fundId: fund._id });
  };

  return (
    <View>
      <FundProfileInfo fund={fund} showTags highlightManager />
      <View style={styles.actionBar}>
        <View style={styles.buttonContainer}>
          <Tooltip
            isVisible={index === 0 && showTutorialBtn}
            content={
              <View style={pStyles.tooltipContainer}>
                <Text style={pStyles.tooltipText}>
                  Found a fund you like? Learn about their strategy and
                  performance.
                </Text>
                <Pressable
                  onPress={() => {
                    setShowTutorialBtn(false);
                    setShowTutorialForStar(true);
                  }}
                  style={pStyles.tooltipButton}>
                  <Text style={pStyles.tooltipButtonText}>Next</Text>
                </Pressable>
              </View>
            }
            contentStyle={pStyles.tooltipContent}
            placement="top"
            onClose={() => console.log('')}>
            <PGradientOutlineButton
              label={
                fund.limitedView
                  ? 'View Strategy Overview'
                  : 'View Fund Details'
              }
              textStyle={styles.button}
              btnContainer={styles.buttonContainer}
              onPress={goToFund}
            />
          </Tooltip>
        </View>
        <Tooltip
          isVisible={index === 0 && showTutorialForStar}
          content={
            <View style={pStyles.tooltipContainer}>
              <Text style={pStyles.tooltipText}>
                Add to your View watchlist
              </Text>
              <Pressable
                onPress={() => {
                  setShowTutorialBtn(false);
                  setShowTutorialForStar(false);
                  EventRegister.emit('tutorialManagers');
                }}
                style={pStyles.tooltipButton}>
                <Text style={pStyles.tooltipButtonText}>Next</Text>
              </Pressable>
            </View>
          }
          contentStyle={pStyles.tooltipContent}
          placement="top"
          onClose={() => console.log('')}>
          <Pressable
            onPress={toggleWatch}
            style={({ pressed }) => [pressed ? styles.onPress : undefined]}>
            <Star
              size={24}
              color={isWatching ? PRIMARYSTATE : WHITE}
              style={styles.favorite}
              weight={isWatching ? 'fill' : 'regular'}
            />
          </Pressable>
        </Tooltip>
      </View>
    </View>
  );
};

export default FundItem;

const styles = StyleSheet.create({
  actionBar: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    fontWeight: 'bold',
    textTransform: 'none',
  },
  favorite: {
    marginLeft: 16,
  },
  onPress: {
    opacity: 0.5,
  },
});
