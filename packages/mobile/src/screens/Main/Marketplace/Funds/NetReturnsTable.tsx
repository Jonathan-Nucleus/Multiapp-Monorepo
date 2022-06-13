import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import PText from 'mobile/src/components/common/PText';
import dayjs from 'dayjs';
import localData from 'dayjs/plugin/localeData';
dayjs.extend(localData);

import { WHITE, WHITE12, PRIMARYSOLID, GRAY1 } from 'shared/src/colors';
import { Body2Bold, Body3 } from 'mobile/src/theme/fonts';

import { FundDetails } from 'shared/graphql/query/marketplace/useFund';

interface NetReturnsTableProps {
  returns: FundDetails['metrics'];
}

const MONTHS = dayjs().localeData().monthsShort();

const NetReturnsTable: FC<NetReturnsTableProps> = ({ returns }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const sortedReturns = returns.sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
  const earliestYear = sortedReturns[0]?.date.getFullYear();
  const latestYear =
    sortedReturns[sortedReturns.length - 2]?.date.getFullYear(); // Assume last entry is YTD for last year
  const pages = [...Array(Math.ceil((latestYear - earliestYear + 1) / 3))]
    .map((_, index) => index)
    .reverse();

  return (
    <View style={styles.container}>
      <PagerView
        style={styles.flex}
        showPageIndicator={false}
        onPageSelected={(evt) => {
          setCurrentPage(evt.nativeEvent.position);
        }}
        transitionStyle="scroll"
        overdrag={true}>
        {pages.map((page) => {
          const startYear = latestYear - (pages.length - page) * 3 + 1;
          const years = [...Array(3)]
            .map((_, index) => startYear + index)
            .reverse();

          return (
            <View key={page} collapsable={false} style={styles.page}>
              <View style={styles.metricsTable}>
                <View style={styles.col}>
                  <PText style={styles.row} />
                  {MONTHS.map((month) => (
                    <PText key={month} style={[styles.row, styles.header]}>
                      {month}
                    </PText>
                  ))}
                  <PText style={[styles.row, styles.header]}>YR</PText>
                </View>
                {years.map((year, yearIndex) => {
                  const ytdFigure = sortedReturns.find(
                    (metric) =>
                      metric.date.getUTCMonth() === 0 &&
                      metric.date.getUTCFullYear() === year + 1 &&
                      metric.date.getUTCDate() === 1,
                  )?.figure;

                  return (
                    <View
                      key={year}
                      style={[
                        styles.col,
                        yearIndex < years.length - 1
                          ? styles.borderRight
                          : null,
                      ]}>
                      <PText style={[styles.row, styles.header]}>{year}</PText>
                      {MONTHS.map((month, index) => {
                        const figure = sortedReturns.find(
                          (metric) =>
                            metric.date.getUTCMonth() === index &&
                            metric.date.getUTCFullYear() === year &&
                            metric.date.getUTCDate() !== 1,
                        )?.figure;

                        return (
                          <PText
                            key={month}
                            style={[styles.row, styles.figure]}>
                            {figure !== undefined
                              ? `${figure.toFixed(1)}%`
                              : '--'}
                          </PText>
                        );
                      })}
                      <PText style={[styles.row, styles.figure]}>
                        {ytdFigure !== undefined
                          ? `${ytdFigure.toFixed(1)}%`
                          : '--'}
                      </PText>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </PagerView>
      <View style={styles.pageIndicators}>
        {[...Array(pages.length)].map((_, index) => (
          <View
            style={[
              styles.pageIndicator,
              index === currentPage ? styles.selectedIndicator : null,
            ]}
            key={index}
          />
        ))}
      </View>
    </View>
  );
};

export default NetReturnsTable;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    height: 488,
    marginHorizontal: 16,
    overflow: 'visible',
    marginVertical: 16,
  },
  page: {
    flex: 1,
    alignItems: 'center',
  },
  pageIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: GRAY1,
  },
  selectedIndicator: {
    backgroundColor: PRIMARYSOLID,
  },
  metricsTable: {
    flexDirection: 'row',
    borderRadius: 16,
    borderColor: WHITE12,
    borderWidth: 1,
    paddingTop: 4,
    paddingBottom: 8,
    width: 300,
  },
  row: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: WHITE,
    height: 32,
    borderColor: WHITE12,
    borderBottomWidth: 1,
  },
  col: {
    flex: 1,
    paddingRight: 8,
  },
  borderRight: {
    borderColor: WHITE12,
    borderRightWidth: 1,
  },
  header: {
    textAlign: 'right',
    ...Body2Bold,
  },
  figure: {
    textAlign: 'right',
    ...Body3,
    lineHeight: 20,
  },
});
