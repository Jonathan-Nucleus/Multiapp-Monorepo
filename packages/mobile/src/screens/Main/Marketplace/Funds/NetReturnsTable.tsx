import React, { FC } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PagerView from 'react-native-pager-view';
import dayjs from 'dayjs';
import localData from 'dayjs/plugin/localeData';
dayjs.extend(localData);

import { WHITE, WHITE12 } from 'shared/src/colors';
import { Body2Bold, Body3 } from 'mobile/src/theme/fonts';

import { FundDetails } from 'shared/graphql/query/marketplace/useFund';

interface NetReturnsTableProps {
  returns: FundDetails['metrics'];
}

const MONTHS = dayjs().localeData().monthsShort();

const NetReturnsTable: FC<NetReturnsTableProps> = ({ returns }) => {
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
    <PagerView
      style={styles.container}
      showPageIndicator={true}
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
                <Text style={styles.row} />
                {MONTHS.map((month) => (
                  <Text key={month} style={[styles.row, styles.header]}>
                    {month}
                  </Text>
                ))}
                <Text style={[styles.row, styles.header]}>YR</Text>
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
                      yearIndex < years.length - 1 ? styles.borderRight : null,
                    ]}>
                    <Text style={[styles.row, styles.header]}>{year}</Text>
                    {MONTHS.map((month, index) => {
                      const figure = sortedReturns.find(
                        (metric) =>
                          metric.date.getUTCMonth() === index &&
                          metric.date.getUTCFullYear() === year &&
                          metric.date.getUTCDate() !== 1,
                      )?.figure;

                      return (
                        <Text key={month} style={[styles.row, styles.figure]}>
                          {figure !== undefined
                            ? `${figure.toFixed(1)}%`
                            : '--'}
                        </Text>
                      );
                    })}
                    <Text style={[styles.row, styles.figure]}>
                      {ytdFigure !== undefined
                        ? `${ytdFigure.toFixed(1)}%`
                        : '--'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </PagerView>
  );
};

export default NetReturnsTable;

const styles = StyleSheet.create({
  container: {
    height: 500,
    marginHorizontal: 16,
    overflow: 'visible',
    marginVertical: 16,
  },
  page: {
    flex: 1,
    alignItems: 'center',
  },
  metricsTable: {
    flexGrow: 0,
    flexShrink: 1,
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
