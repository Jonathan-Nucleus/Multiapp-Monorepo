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
  Pressable,
  Linking,
} from 'react-native';
import { Presentation, File } from 'phosphor-react-native';
import FastImage from 'react-native-fast-image';
import dayjs from 'dayjs';

import Tag from 'mobile/src/components/common/Tag';
import PLabel from 'mobile/src/components/common/PLabel';
import Avatar from 'mobile/src/components/common/Avatar';
import Media from 'mobile/src/components/common/Media';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import pStyles from 'mobile/src/theme/pStyles';
import {
  Body1,
  Body1Bold,
  Body2Bold,
  Body3,
  H6Bold,
} from 'mobile/src/theme/fonts';
import {
  PRIMARY,
  WHITE,
  GRAY100,
  WHITE12,
  BLACK,
  BGDARK,
  BGDARK200,
  WHITE60,
} from 'shared/src/colors';

import RecentDoc from 'shared/assets/images/recent-doc.svg';
import { AssetClasses } from 'shared/graphql/fragments/fund';
import {
  FundDetails,
  DocumentCategories,
  DocumentCategory,
} from 'shared/graphql/query/marketplace/useFund';
import { fundsUrl } from 'mobile/src/utils/env';

interface FundDocumentsProps extends ViewProps {
  fund: FundDetails;
}

const FundDocuments: FC<FundDocumentsProps> = ({ fund, ...viewProps }) => {
  const { documents } = fund;
  const categories = new Set<DocumentCategory>();

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
      {Array.from(categories).map((category) => (
        <View key={category} style={styles.sectionContainer}>
          <View style={styles.row}>
            <Text style={[styles.textWhite, styles.sectionTitle]}>
              {DocumentCategories[category]}
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
      ))}
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
