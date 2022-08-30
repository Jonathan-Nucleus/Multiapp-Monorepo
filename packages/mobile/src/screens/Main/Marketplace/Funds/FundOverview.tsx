import React, { FC, useState } from 'react';
import {
  View,
  StyleSheet,
  ViewProps,
  Pressable,
  Linking,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { Presentation, Info } from 'phosphor-react-native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import Tag from 'mobile/src/components/common/Tag';
import PLabel from 'mobile/src/components/common/PLabel';
import PText from 'mobile/src/components/common/PText';
import PMarkdown from 'mobile/src/components/common/PMarkdown';
import Accordion from 'mobile/src/components/common/Accordion';
import TeamList from 'mobile/src/components/main/funds/TeamList';
import DetailedTeamList from 'mobile/src/components/main/funds/DetailedTeamList';
import { FundMedia } from 'mobile/src/components/common/Attachment';
import Disclosure from 'mobile/src/components/main/Disclosure';
import pStyles from 'mobile/src/theme/pStyles';
import {
  Body1Semibold,
  Body2Bold,
  Body2,
  Body3,
  H6Bold,
} from 'mobile/src/theme/fonts';
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

import { useDocumentToken } from 'shared/graphql/query/account/useDocumentToken';
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
  const [videoIndex, setVideoIndex] = useState(0);
  const [fetchDocumentToken] = useDocumentToken();

  const video = fund.videos?.[videoIndex];
  const dollarFormatter = Intl.NumberFormat('en', { notation: 'compact' });

  const renderVideo: ListRenderItem<string> = ({ item: vid, index }) => (
    <Pressable
      key={vid}
      style={styles.videoPreview}
      onPress={() => setVideoIndex(index)}>
      <View pointerEvents="none">
        <FundMedia
          attachment={{ url: vid, aspectRatio: 1.58 }}
          mediaId={fund._id}
          style={styles.videoPreviewItem}
          controls={false}
          onLoad={() => console.log('loaded')}
        />
      </View>
    </Pressable>
  );

  const presentation = fund.documents
    ?.filter((doc) => doc.category === 'PRESENTATION')
    ?.sort((a, b) => b.date.getTime() - a.date.getTime())?.[0];

  const goToPresentation = async (): Promise<void> => {
    if (!presentation) {
      return;
    }

    try {
      const { data } = await fetchDocumentToken({
        variables: {
          fundId: fund._id,
          document: presentation.url,
        },
      });

      if (data && data.documentToken) {
        Linking.openURL(
          `${process.env.NEXT_PUBLIC_WATERMARKING_SERVICE_URL}?token=${data.documentToken}`,
        );
      }
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
    }
  };

  return (
    <View {...viewProps} style={[styles.overviewContainer, viewProps.style]}>
      {video ? (
        <View style={styles.videoContainer}>
          <FundMedia
            attachment={{ url: video, aspectRatio: 1.58 }}
            mediaId={fund._id}
          />
        </View>
      ) : null}
      {fund.videos && fund.videos.length > 1 ? (
        <FlatList
          data={fund.videos}
          renderItem={renderVideo}
          keyExtractor={(item) => item}
          horizontal={true}
          style={styles.videoList}
        />
      ) : null}
      <View style={styles.fundDetailsContainer}>
        <PLabel textStyle={styles.fund} label="Strategy Overview" />
        <PMarkdown>{fund.overview}</PMarkdown>
        {presentation ? (
          <Pressable
            style={({ pressed }) => [
              styles.presentationContainer,
              pressed ? pStyles.pressedStyle : null,
            ]}
            onPress={goToPresentation}>
            <Presentation size={32} color={WHITE} />
            <PLabel
              textStyle={styles.presentationLabel}
              label="View Presentation"
            />
          </Pressable>
        ) : null}
        {fund.tags && fund.tags.length > 0 && (
          <View style={styles.tags}>
            {fund.tags.map((tag, index) => (
              <React.Fragment key={tag}>
                <Tag label={tag} viewStyle={styles.tagStyle} />
                {index < fund.tags.length - 1 ? (
                  <PText style={styles.tagSeparator}>•</PText>
                ) : null}
              </React.Fragment>
            ))}
          </View>
        )}
      </View>
      {!fund.limitedView ? (
        <View>
          <View style={styles.infoContainer}>
            <PLabel textStyle={styles.fund} label="Fund Details" />
          </View>
          <View style={styles.infoContainer}>
            <PTitle
              title="Asset Class"
              subTitle={
                AssetClasses.find(
                  (assetClass) => assetClass.value === fund.class,
                )?.label ?? ''
              }
              flex={LEFT_FLEX}
            />
            <PTitle
              title="Strategy"
              subTitle={fund.strategy}
              flex={RIGHT_FLEX}
            />
          </View>
          {'aum' in fund === true && fund.aum !== null ? (
            <View style={styles.infoContainer}>
              <PTitle
                title="Fund AUM"
                subTitle={`$${dollarFormatter.format(fund.aum!)}`}
              />
            </View>
          ) : null}
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
            <PText style={styles.fee}>
              {fund.fees.map((fee) => `${fee.label}: ${fee.value}`).join(' • ')}
            </PText>
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
      ) : null}
      {fund.limitedView ? (
        <DetailedTeamList team={[fund.manager, ...fund.team]} />
      ) : (
        <TeamList team={[fund.manager, ...fund.team]} />
      )}
      {!fund.limitedView && fund.metrics && fund.metrics.length > 0 ? (
        <View style={styles.memberContainer}>
          <PLabel textStyle={styles.fund} label="Monthly Net Return" />
          <NetReturnsTable returns={fund.metrics} />
        </View>
      ) : null}
      {fund.disclosure ? (
        <Accordion
          title={fund.limitedView ? 'Important Notes' : 'Fund Disclosures'}
          titleStyle={styles.fundDisclosureHeader}
          containerStyle={styles.fundDisclosure}>
          <PText style={styles.fundDisclosureText}>{fund.disclosure}</PText>
        </Accordion>
      ) : null}
      <Pressable
        onPress={() => setDisclosureVisible(true)}
        style={({ pressed }) => [
          styles.disclosureContainer,
          pressed ? pStyles.pressedStyle : null,
        ]}>
        <Info color={WHITE60} size={20} />
        <PText style={styles.disclosureText}>Prometheus Disclosures</PText>
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
  videoPreview: {
    width: 88,
    borderColor: WHITE12,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 16,
  },
  videoPreviewItem: {
    borderRadius: 4,
    marginVertical: 0,
  },
  videoList: {
    marginHorizontal: 16,
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
    marginTop: 36,
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
    marginTop: 16,
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
  fundDisclosureHeader: {
    textTransform: 'uppercase',
    letterSpacing: 1.25,
    ...Body1Semibold,
  },
  fundDisclosureText: {
    color: GRAY600,
    marginBottom: 8,
    lineHeight: 18,
    letterSpacing: 1.125,
    ...Body3,
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
