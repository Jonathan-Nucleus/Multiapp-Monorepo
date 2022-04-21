import React, { FC } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
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
  BGDARK,
  WHITE60,
} from 'shared/src/colors';
import { Body2Bold, Body3, H6Bold } from 'mobile/src/theme/fonts';
import Tag from '../../../components/common/Tag';
import PLabel from '../../../components/common/PLabel';
import { FundItemProps } from '../../../components/main/FundItem';
import { Presentation } from 'phosphor-react-native';

import type { User } from 'backend/graphql/users.graphql';

interface MemberProps {
  item: User;
}

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
  const renderTeamMemberItem = ({ item }: MemberProps) => {
    return (
      <TouchableOpacity>
        <View
          style={[
            styles.memberItem,
            fund.team.length === 1 && styles.fullWidth,
          ]}>
          <FastImage
            style={styles.avatar}
            source={{
              uri: `${AVATAR_URL}/${item?.avatar}`,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <PLabel
            textStyle={styles.name}
            label={`${item.firstName} ${item.lastName}`}
          />
          <PLabel textStyle={styles.position} label={item.position || ''} />
        </View>
      </TouchableOpacity>
    );
  };

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
        <PLabel textStyle={styles.fund} label="Strategy Overview" />
        {fund.highlights && fund.highlights.length > 0 && (
          <View style={styles.highlightContainer}>
            {fund.highlights.map((item, index) => (
              <View key={index} style={styles.highlightItem}>
                <View style={styles.bullet} />
                <PLabel
                  label={item}
                  viewStyle={styles.highlightLabelContainer}
                />
              </View>
            ))}
          </View>
        )}
        {/* <Text style={[styles.overview, styles.whiteText, Body2]}>
          {fund.overview}
        </Text> */}
        <View style={styles.presentationContainer}>
          <Presentation size={32} color={WHITE} />
          <PLabel
            textStyle={styles.presentationLabel}
            label="View Presentation"
          />
        </View>
        {fund.tags && fund.tags.length > 0 && (
          <View style={styles.tags}>
            {fund.tags.map((tag, index) => (
              <Tag label={tag} viewStyle={styles.tagStyle} key={index} />
            ))}
          </View>
        )}
        <View style={styles.infoContainer}>
          <PLabel textStyle={styles.fund} label="Fund Details" />
        </View>
        <View style={styles.infoContainer}>
          <PTitle title="Asset Class" subTitle={fund.name} />
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
        <View style={styles.memberContainer}>
          <PLabel label="Team Members" />
          <FlatList
            data={fund.team}
            keyExtractor={(item) => item._id}
            renderItem={renderTeamMemberItem}
            showsVerticalScrollIndicator={false}
            horizontal={true}
          />
        </View>
        <View style={styles.infoContainer}>
          <PLabel textStyle={styles.fund} label="Highlights" />
        </View>
        <View style={styles.infoContainer}>
          <PTitle title="annualized volatility" subTitle="2.8%" />
          <PTitle title="ARSI" subTitle="2.8%" />
        </View>
        <View style={styles.infoContainer}>
          <PTitle title="MTD Return" subTitle="3.2%" />
          <PTitle title="YTD Return" subTitle="3.1%" />
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
    height: 206,
    borderRadius: 16,
    marginHorizontal: 15,
    marginTop: 24,
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
    ...H6Bold,
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
  infoContainer: {
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
    paddingVertical: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  highlightContainer: {
    marginTop: 16,
  },
  highlightItem: {
    marginVertical: 3,
    flexDirection: 'row',
    alignContent: 'center',
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: WHITE,
    marginRight: 8,
    marginTop: 5,
  },
  highlightLabelContainer: {
    width: '90%',
  },
  memberContainer: {
    marginTop: 16,
  },
  memberItem: {
    borderColor: BGDARK,
    borderWidth: 1,
    width: Dimensions.get('screen').width / 2 - 20,
    height: 180,
    alignItems: 'center',
    padding: 8,
    marginVertical: 16,
    marginRight: 8,
    borderRadius: 8,
    alignSelf: 'center',
  },
  fullWidth: {
    width: Dimensions.get('screen').width - 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  name: {
    ...Body2Bold,
  },
  position: {
    ...Body3,
    color: WHITE60,
    marginTop: 8,
    textAlign: 'center',
  },
});
