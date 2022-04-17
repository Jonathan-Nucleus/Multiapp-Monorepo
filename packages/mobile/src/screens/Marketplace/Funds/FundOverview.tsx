import React, { FC } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { AVATAR_URL, BACKGROUND_URL } from 'react-native-dotenv';

import {
  PRIMARY,
  WHITE,
  SUCCESS,
  DANGER,
  GRAY100,
  WHITE12,
  BLACK,
} from 'shared/src/colors';
import { Body1, Body2, Body2Bold, H6Bold } from 'mobile/src/theme/fonts';
import Tag from '../../../components/common/Tag';
import PLabel from '../../../components/common/PLabel';
import { FundItemProps } from '../../../components/main/FundItem';
import { Presentation } from 'phosphor-react-native';

const PTitle = (props) => {
  const { title, subTitle } = props;

  return (
    <View>
      <PLabel textStyle={styles.title} label={title} />
      <PLabel label={subTitle} />
    </View>
  );
};

const FundOverview: FC<FundItemProps> = ({ fund }) => {
  return (
    <View style={styles.overviewContainer}>
      <View style={styles.imagesContainer}>
        <FastImage
          style={styles.backgroundImage}
          source={{ uri: `${BACKGROUND_URL}/${fund.background.url}` }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <View style={styles.fundDetailsContainer}>
        <PLabel textStyle={[H6Bold, styles.fund]} label="Strategy Overview" />
        <Text style={[styles.overview, styles.whiteText, Body2]}>
          {fund.overview}
        </Text>
        <View style={styles.presentationContainer}>
          <Presentation size={32} color={WHITE} />
          <PLabel
            textStyle={styles.presentationLabel}
            label="View Presentation"
          />
        </View>
        <View style={styles.tags}>
          {fund.tags.map((tag, index) => (
            <Tag label={tag} viewStyle={styles.tagStyle} key={index} />
          ))}
        </View>
        <View style={styles.infoContainer}>
          <PLabel textStyle={[H6Bold, styles.fund]} label="Fund Details" />
        </View>
        <View style={styles.infoContainer}>
          <PTitle title="Asset Class" subTitle="Hedge Fund" />
          <PTitle title="Strategy" subTitle="L/S Equity" />
        </View>
        <View style={styles.infoContainer}>
          <PTitle title="AUM" subTitle="$10M" />
        </View>
        <View style={styles.infoContainer}>
          <PTitle title="Minimum Investment" subTitle="$25K" />
          <PTitle title="Lockup Period" subTitle="2 years" />
        </View>
        <View style={styles.infoContainer}>
          <PTitle title="liquidity" subTitle="Quarterly w/30 days notice" />
        </View>
      </View>
    </View>
  );
};

export default FundOverview;

const styles = StyleSheet.create({
  overviewContainer: {
    backgroundColor: BLACK,
  },
  imagesContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'visible',
    zIndex: 2,
  },
  backgroundImage: {
    width: '100%',
    height: 206,
  },
  avatarImage: {
    width: 64,
    aspectRatio: 1,
    borderRadius: 4,
    position: 'absolute',
    left: 16,
    bottom: -32,
  },
  fundDetailsContainer: {
    padding: 16,
    borderColor: WHITE12,
    borderBottomWidth: 1,
    zIndex: 1,
  },
  whiteText: {
    color: WHITE,
  },
  grayText: {
    color: GRAY100,
  },
  successText: {
    color: SUCCESS,
  },
  dangerText: {
    color: DANGER,
  },
  fund: {
    marginTop: 16,
    lineHeight: 24,
  },
  overview: {
    lineHeight: 20,
  },
  presentationContainer: {
    marginVertical: 36,
    flexDirection: 'row',
    alignItems: 'center',
  },
  presentationLabel: {
    color: PRIMARY,
    ...Body2Bold,
    marginLeft: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 16,
  },
  tagStyle: {
    marginRight: 8,
  },
  titleContainer: {},
  center: {
    textAlign: 'center',
    marginTop: 4,
  },
  title: {
    textTransform: 'uppercase',
    color: GRAY100,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 8,
  },
  actionBar: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
    paddingVertical: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
