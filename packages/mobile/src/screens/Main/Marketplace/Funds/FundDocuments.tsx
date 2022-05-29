import React, { FC, useEffect } from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  Text,
  Pressable,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { File } from 'phosphor-react-native';
import dayjs from 'dayjs';

import pStyles from 'mobile/src/theme/pStyles';
import { Body1, Body3, H6Bold } from 'mobile/src/theme/fonts';
import { WHITE, WHITE12, BLACK, BGDARK200, WHITE60 } from 'shared/src/colors';

import RecentDoc from 'shared/assets/images/recent-doc.svg';
import { AssetClasses } from 'shared/graphql/fragments/fund';
import {
  FundDetails,
  DocumentCategories,
  DocumentCategory,
} from 'shared/graphql/query/marketplace/useFund';
import { fundsUrl } from 'mobile/src/utils/env';

import { FundDetailsTabs } from './FundDetails';

interface FundDocumentsProps extends ViewProps {
  fund: FundDetails;
  onFocus?: () => void;
}

const FundDocuments: FC<FundDocumentsProps> = ({
  fund,
  onFocus,
  ...viewProps
}) => {
  const { documents } = fund;
  const categories = new Set<DocumentCategory>();

  const navigation = useNavigation<FundDetailsTabs>();
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      onFocus?.();
    });

    return unsubscribe;
  }, [navigation, onFocus]);

  const documentsSorted = [...documents];
  documentsSorted.sort((a, b) => b.date.getTime() - a.date.getTime());
  documentsSorted.forEach((doc) => categories.add(doc.category));

  const goToFile = (url: string): void => {
    Linking.openURL(`${fundsUrl()}/${fund._id}/${url}`);
  };

  return (
    <View {...viewProps} style={[styles.documentsContainer, viewProps.style]}>
      <View style={styles.sectionContainer}>
        <View style={styles.row}>
          <Text style={[styles.textWhite, styles.sectionTitle]}>
            Recently Added
          </Text>
        </View>
        {documentsSorted.slice(0, 2)?.map((doc) => {
          return (
            <Pressable
              key={doc.url}
              onPress={() => goToFile(doc.url)}
              style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}>
              <View style={styles.recentContainer}>
                <RecentDoc />
                <View style={styles.recentInfo}>
                  <Text style={styles.textWhite}>{doc.title}</Text>
                  <Text style={styles.date}>
                    {dayjs(doc.date).format('MMMM D, YYYY h:mmA')}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
      {DocumentCategories.map((orderedCategory) => {
        const category = orderedCategory.value;
        if (!categories.has(category)) return null;

        return (
          <View key={category} style={styles.sectionContainer}>
            <View style={styles.row}>
              <Text style={[styles.textWhite, styles.sectionTitle]}>
                {orderedCategory.label}
              </Text>
            </View>
            {documentsSorted
              .filter((doc) => doc.category === category)
              .map((doc) => (
                <Pressable
                  key={doc.url}
                  onPress={() => goToFile(doc.url)}
                  style={({ pressed }) =>
                    pressed ? pStyles.pressedStyle : null
                  }>
                  <View style={styles.row}>
                    <File size={24} color={WHITE} />
                    <View style={styles.docInfo}>
                      <Text style={styles.textWhite}>{doc.title}</Text>
                      <Text style={styles.date}>
                        {dayjs(doc.date).format('MMMM D, YYYY h:mmA')}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
          </View>
        );
      })}
    </View>
  );
};

export default FundDocuments;

const styles = StyleSheet.create({
  documentsContainer: {
    backgroundColor: BLACK,
  },
  sectionContainer: {
    marginTop: 20,
    width: '100%',
  },
  sectionTitle: {
    ...H6Bold,
    paddingVertical: 8,
  },
  textWhite: {
    color: WHITE,
    marginBottom: 8,
    ...Body1,
  },
  date: {
    color: WHITE60,
    ...Body3,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderColor: WHITE12,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  recentContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    marginTop: 16,
  },
  recentInfo: {
    flex: 1,
    backgroundColor: BGDARK200,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  docInfo: {
    flex: 1,
    padding: 16,
  },
});
