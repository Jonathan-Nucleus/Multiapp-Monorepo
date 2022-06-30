import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, Text, DeviceEventEmitter} from 'react-native';
import { Star } from 'phosphor-react-native';

import PGradientOutlineButton from 'mobile/src/components/common/PGradientOutlineButton';
import { navigate } from 'mobile/src/services/navigation/NavigationService';
import { PRIMARYSTATE, WHITE } from 'shared/src/colors';
import {
  FundSummary,
  FundCompany,
  FundManager,
} from 'shared/graphql/fragments/fund';
import FundProfileInfo from './FundProfileInfo';

import { useWatchFund } from 'shared/graphql/mutation/funds/useWatchFund';
import pStyles from "../../../theme/pStyles";
import Tooltip from "react-native-walkthrough-tooltip";

export type Fund = FundSummary & FundCompany & FundManager;

export interface FundItemProps {
  fund: Fund;
  showOverview?: boolean;
  showTags?: boolean;
  category?: string;
  index: number;
}

const FundItem: FC<FundItemProps> = ({ fund, category }) => {
  const { isWatching, toggleWatch } = useWatchFund(fund._id);
  const [showTutorialBtn, setShowTutorialBtn] = useState(false);
  const [showTutorialStar, setShowTutorialStar] = useState(false);

  useEffect(() => {
    DeviceEventEmitter.addListener('tutorialFundItem', () => {
      setShowTutorialBtn(true);
      setShowTutorialStar(false);
    });
    // emitter.remove();
  });

  const goToFund = (): void => {
    navigate('FundDetails', { fundId: fund._id });
  };

  return (
    <View>
      <FundProfileInfo
        fund={fund}
        category={category}
        showTags
        highlightManager
      />
      <View style={styles.actionBar}>
        <View style={styles.buttonContainer}>
          <Tooltip
              isVisible={showTutorialBtn}
              content={
                <View style={pStyles.tooltipContainer}>
                  <Text style={pStyles.tooltipText}> Tap here to filter your newsfeed.</Text>
                  <Pressable onPress={() => {
                    setShowTutorialBtn(false);
                    setShowTutorialStar(true);
                  }} style={pStyles.tooltipButton}>
                    <Text style={pStyles.tooltipButtonText}>Next</Text>
                  </Pressable>
                </View>
              }
              contentStyle={pStyles.tooltipContent}
              placement="top"
              onClose={() => console.log('')}>
            <PGradientOutlineButton
                label={
                  category === 'equity'
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
            isVisible={showTutorialStar}
            content={
              <View style={pStyles.tooltipContainer}>
                <Text style={pStyles.tooltipText}> Tap here to filter your newsfeed.</Text>
                <Pressable onPress={() => {
                  setShowTutorialBtn(false);
                  setShowTutorialStar(false);
                  DeviceEventEmitter.emit('tutorialManagers');
                }} style={pStyles.tooltipButton}>
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
