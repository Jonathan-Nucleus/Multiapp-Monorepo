import React, { FC } from 'react';
import {
  ListRenderItem,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ViewProps,
  Text,
} from 'react-native';
import { Presentation } from 'phosphor-react-native';
import FastImage from 'react-native-fast-image';

import Tag from 'mobile/src/components/common/Tag';
import PLabel from 'mobile/src/components/common/PLabel';
import Avatar from 'mobile/src/components/common/Avatar';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import { Body1Bold, Body2Bold, Body3, H6Bold } from 'mobile/src/theme/fonts';
import {
  PRIMARY,
  WHITE,
  GRAY100,
  WHITE12,
  BLACK,
  BGDARK,
  WHITE60,
} from 'shared/src/colors';

import { AssetClasses } from 'shared/graphql/fragments/fund';
import { FundDetails } from 'shared/graphql/query/marketplace/useFund';
import { backgroundUrl } from 'mobile/src/utils/env';

interface PTitleProps {
  title: string;
  subTitle: string;
  flex?: number;
}

interface FundOverviewProps extends ViewProps {
  fund: FundDetails;
}

const PTitle: FC<PTitleProps> = ({ title, subTitle, flex }) => {
  return (
    <View style={{ flex }}>
      <PLabel textStyle={styles.title} label={title} />
      <PLabel label={subTitle} />
    </View>
  );
};

const LEFT_FLEX = 0.6;
const RIGHT_FLEX = 0.4;

const FundOverview: FC<FundOverviewProps> = ({ fund, ...viewProps }) => {
  const renderTeamMemberItem: ListRenderItem<FundDetails['team'][number]> = ({
    item,
  }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          NavigationService.navigate('UserDetails', {
            screen: 'UserProfile',
            params: {
              userId: item._id,
            },
          })
        }>
        <View
          style={[
            styles.memberItem,
            fund.team.length === 1 && styles.fullWidth,
          ]}>
          <Avatar user={item} size={80} style={styles.avatar} />
          <PLabel
            textStyle={styles.name}
            label={`${item.firstName} ${item.lastName}`}
          />
          <PLabel textStyle={styles.position} label={item.position || ''} />
        </View>
      </TouchableOpacity>
    );
  };

  const { background } = fund.company;
  const dollarFormatter = Intl.NumberFormat('en', { notation: 'compact' });

  return (
    <View {...viewProps} style={[styles.overviewContainer, viewProps.style]}>
      <View style={styles.imagesContainer}>
        {background && (
          <FastImage
            style={styles.backgroundImage}
            source={{ uri: `${backgroundUrl()}/${background.url}` }}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}
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
                  textStyle={styles.highlightLabel}
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
              <React.Fragment key={tag}>
                <Tag label={tag} viewStyle={styles.tagStyle} />
                {index < fund.tags.length - 1 ? (
                  <Text style={styles.tagSeparator}>•</Text>
                ) : null}
              </React.Fragment>
            ))}
          </View>
        )}
      </View>
      <View>
        <View style={styles.infoContainer}>
          <PLabel textStyle={styles.fund} label="Fund Details" />
        </View>
        <View style={styles.infoContainer}>
          <PTitle
            title="Asset Class"
            subTitle={AssetClasses[fund.class]}
            flex={LEFT_FLEX}
          />
          <PTitle title="Strategy" subTitle={fund.strategy} flex={RIGHT_FLEX} />
        </View>
        <View style={styles.infoContainer}>
          <PTitle
            title="AUM"
            subTitle={`$${dollarFormatter.format(fund.aum)}`}
          />
        </View>
        <View style={styles.infoContainer}>
          <PTitle
            title="Minimum Investment"
            subTitle={`$${dollarFormatter.format(fund.min)}`}
            flex={LEFT_FLEX}
          />
          <PTitle
            title="Lockup Period"
            subTitle={
              fund.lockup === 0
                ? 'None'
                : `${fund.lockup} ${fund.lockup === 1 ? 'year' : 'years'}`
            }
            flex={RIGHT_FLEX}
          />
        </View>
        <View style={styles.infoContainer}>
          <PTitle title="liquidity" subTitle={fund.liquidity} />
        </View>
        <View style={styles.infoContainer}>
          <PLabel textStyle={styles.fund} label="Highlights" />
        </View>
        <View style={styles.attributesContainer}>
          {fund.attributes.map((attribute) => (
            <View key={attribute.label} style={styles.attribute}>
              <PTitle title={attribute.label} subTitle={attribute.value} />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.memberContainer}>
        <PLabel label="Team Members" textStyle={styles.sectionTitle} />
        <FlatList
          data={[fund.manager, ...fund.team]}
          keyExtractor={(item) => item._id}
          renderItem={renderTeamMemberItem}
          showsVerticalScrollIndicator={false}
          horizontal={true}
        />
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
  fund: {
    marginTop: 16,
    lineHeight: 24,
    ...H6Bold,
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
    alignItems: 'center',
  },
  tagStyle: {
    marginRight: 4,
    backgroundColor: 'transparent',
  },
  tagSeparator: {
    color: WHITE60,
    marginRight: 4,
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
    padding: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  highlightContainer: {
    marginTop: 16,
  },
  highlightLabel: {
    lineHeight: 20,
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
  attributesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  attribute: {
    flex: 1,
    flexBasis: '50%',
    paddingLeft: 16,
    paddingVertical: 16,
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
  },
  memberContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
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
    marginBottom: 16,
  },
  name: {
    ...Body2Bold,
    textTransform: 'capitalize',
  },
  position: {
    ...Body3,
    color: WHITE60,
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 16,
    ...Body1Bold,
  },
});
