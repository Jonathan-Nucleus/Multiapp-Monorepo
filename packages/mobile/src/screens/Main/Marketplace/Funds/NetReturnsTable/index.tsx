import React, { FC } from 'react';
import { StyleSheet, FlatList, View, Text, ListRenderItem } from 'react-native';
import PagerView from 'react-native-pager-view';
import dayjs from 'dayjs';
import localData from 'dayjs/plugin/localeData';
dayjs.extend(localData);

import { BLACK, WHITE, WHITE12 } from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';
import { Body2Bold, Body3 } from 'mobile/src/theme/fonts';

import { FundDetails } from 'shared/graphql/query/marketplace/useFund';

interface NetReturnsTableProps {
  returns: FundDetails['metrics'];
}

const MONTHS = dayjs().localeData().monthsShort();

const NetReturnsTable: FC<NetReturnsTableProps> = ({ returns }) => {
  const earliestYear = returns[0]?.date.getFullYear();
  const latestYear = returns[returns.length - 2]?.date.getFullYear(); // Assume last entry is YTD for last year
  let pages = [...Array(Math.ceil((latestYear - earliestYear + 1) / 3))].map(
    (_, index) => index,
  );

  return (
    <PagerView
      style={styles.container}
      showPageIndicator={true}
      transitionStyle="scroll"
      overdrag={true}>
      {pages.map((page) => {
        const startYear = latestYear - (pages.length - page) * 3 + 1;
        const years = [...Array(3)].map((_, index) => startYear + index);
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
                <Text style={[styles.row, styles.header]}>YTD</Text>
              </View>
              {years.map((year, yearIndex) => {
                const ytdFigure = returns.find(
                  (metric) =>
                    metric.date.getMonth() === 0 &&
                    metric.date.getFullYear() === year + 1 &&
                    metric.date.getDate() === 1,
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
                      const figure = returns.find(
                        (metric) =>
                          metric.date.getMonth() === index &&
                          metric.date.getFullYear() === year &&
                          metric.date.getDate() !== 1,
                      )?.figure;

                      return (
                        <Text key={month} style={[styles.row, styles.figure]}>
                          {figure ? `${figure}%` : '--'}
                        </Text>
                      );
                    })}
                    <Text style={[styles.row, styles.figure]}>
                      {ytdFigure ? `${ytdFigure}%` : '--'}
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
