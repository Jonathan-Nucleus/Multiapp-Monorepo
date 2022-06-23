import React, { FC, useState } from 'react';
import { View, StyleSheet, ViewProps, Text, Pressable } from 'react-native';
import { Presentation, Info } from 'phosphor-react-native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import Tag from 'mobile/src/components/common/Tag';
import PLabel from 'mobile/src/components/common/PLabel';
import Accordion from 'mobile/src/components/common/Accordion';
import TeamList from 'mobile/src/components/main/funds/TeamList';
import { FundMedia } from 'mobile/src/components/common/Media';
import Disclosure from 'mobile/src/components/main/Disclosure';
import pStyles from 'mobile/src/theme/pStyles';
import { Body2Bold, Body2, Body3, H6Bold } from 'mobile/src/theme/fonts';
import {
  PRIMARY,
  WHITE,
  GRAY100,
  GRAY600,
  WHITE12,
  BLACK,
  WHITE60,
} from 'shared/src/colors';

import NetReturnsTable from './NetReturnsTable';

import { AssetClasses } from 'shared/graphql/fragments/fund';
import { FundDetails } from 'shared/graphql/query/marketplace/useFund';

interface PTitleProps {
  title: string;
  subTitle: string;
  flex?: number;
}

interface FundOverviewProps extends ViewProps {
  fund: FundDetails;
  onFocus?: () => void;
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
  const [disclosureVisible, setDisclosureVisible] = useState(false);

  const video = fund.videos?.[0];
  const dollarFormatter = Intl.NumberFormat('en', { notation: 'compact' });

  return (
    <View {...viewProps} style={[styles.overviewContainer, viewProps.style]}>
      {video ? (
        <View style={styles.videoContainer}>
          <FundMedia
            media={{ url: video, aspectRatio: 1.58 }}
            mediaId={fund._id}
          />
        </View>
      ) : null}
      <View style={styles.fundDetailsContainer}>
        <PLabel textStyle={styles.fund} label="Strategy Overview" />
        <Text style={styles.overview}>{fund.overview}</Text>
        {fund.presentationUrl ? (
          <View style={styles.presentationContainer}>
            <Presentation size={32} color={WHITE} />
            <PLabel
              textStyle={styles.presentationLabel}
              label="View Presentation"
            />
          </View>
        ) : null}
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
            subTitle={
              AssetClasses.find((assetClass) => assetClass.value === fund.class)
                ?.label ?? ''
            }
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
            subTitle={fund.lockup}
            flex={RIGHT_FLEX}
          />
        </View>
        <View style={styles.infoContainer}>
          <PTitle title="liquidity" subTitle={fund.liquidity} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.fee}>
            {fund.fees.map((fee) => `${fee.label}: ${fee.value}`).join(' • ')}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <PLabel textStyle={styles.fund} label="Highlights" />
          <PLabel
            textStyle={styles.asOf}
            label={`As of ${dayjs(fund.updatedAt).utc().format('M/DD/YYYY')}`}
          />
        </View>
        <View style={styles.attributesContainer}>
          {fund.attributes.map((attribute) => (
            <View key={attribute.label} style={styles.attribute}>
              <PTitle title={attribute.label} subTitle={attribute.value} />
            </View>
          ))}
        </View>
      </View>
      <TeamList team={[fund.manager, ...fund.team]} />
      {fund.metrics && fund.metrics.length > 0 ? (
        <View style={styles.memberContainer}>
          <PLabel textStyle={styles.fund} label="Monthly Net Return" />
          <NetReturnsTable returns={fund.metrics} />
        </View>
      ) : null}
      {fund.disclosure ? (
        <Accordion
          title="Fund Disclosures"
          containerStyle={styles.fundDisclosure}>
          <Text style={styles.fundDisclosureText}>{fund.disclosure}</Text>
        </Accordion>
      ) : null}
      <Pressable
        onPress={() => setDisclosureVisible(true)}
        style={({ pressed }) => [
          styles.disclosureContainer,
          pressed ? pStyles.pressedStyle : null,
        ]}>
        <Info color={WHITE60} size={20} />
        <Text style={styles.disclosureText}>Prometheus Disclosures</Text>
      </Pressable>
      <Disclosure
        isVisible={disclosureVisible}
        onDismiss={() => setDisclosureVisible(false)}
      />
    </View>
  );
};

export default FundOverview;

const styles = StyleSheet.create({
  overviewContainer: {
    backgroundColor: BLACK,
  },
  videoContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
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
  asOf: {
    marginTop: 16,
    marginRight: 16,
    lineHeight: 24,
    textTransform: 'uppercase',
    color: GRAY100,
    letterSpacing: 1.5,
    ...Body3,
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
  fee: {
    color: GRAY100,
    ...Body2,
  },
  overview: {
    color: WHITE,
    marginTop: 8,
    lineHeight: 20,
    ...Body2,
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
  fundDisclosure: {
    marginTop: -8,
    marginBottom: 8,
  },
  fundDisclosureText: {
    color: GRAY600,
    marginBottom: 8,
  },
  disclosureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderColor: WHITE12,
    borderTopWidth: 1,
    paddingVertical: 8,
    marginBottom: 20,
  },
  disclosureText: {
    color: WHITE60,
    marginLeft: 8,
  },
});
