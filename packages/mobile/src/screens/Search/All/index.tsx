import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  SectionList,
  View,
  Text,
  Pressable,
  ListRenderItem,
  SectionListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { SlidersHorizontal } from 'phosphor-react-native';
import dayjs from 'dayjs';

import { BLACK, WHITE, WHITE12, WHITE60, PRIMARY } from 'shared/src/colors';
import { Body2Bold, H6Bold } from '../../../theme/fonts';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

import UserInfo from 'mobile/src/components/common/UserInfo';
import pStyles from 'mobile/src/theme/pStyles';

import { renderItem as renderFundItem } from '../Funds';
import { renderItem as renderUserItem } from '../People';
import { renderItem as renderCompanyItem } from '../Companies';

import {
  GlobalSearchData,
  SearchResult,
  Post,
  User,
  Fund,
  Company,
} from 'shared/graphql/query/search/useGlobalSearch';

interface AllSearchResultsProps {
  searchResults: GlobalSearchData['globalSearch'];
  search: string;
}

const SECTIONS = [
  { label: 'People', value: 'users' },
  { label: 'Companies', value: 'companies' },
  { label: 'Posts', value: 'posts' },
  { label: 'Funds', value: 'funds' },
] as const;

const renderPostItem: ListRenderItem<Post> = ({ item }) => (
  <Pressable
    style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}
    onPress={() =>
      NavigationService.navigate('PostDetails', {
        screen: 'PostDetail',
        params: {
          postId: item._id,
        },
      })
    }>
    <View style={styles.item}>
      <UserInfo
        user={item.user || item.company}
        avatarSize={56}
        showFollow
        auxInfo={dayjs(item.createdAt).format('MMM D')}
        audienceInfo={item.audience}
      />
      <Text style={styles.body} numberOfLines={2}>
        {item.body}
      </Text>
    </View>
  </Pressable>
);

const AllSearchResults: React.FC<AllSearchResultsProps> = ({
  searchResults,
  search,
}) => {
  const totalResults =
    searchResults.companies.length +
    searchResults.users.length +
    searchResults.posts.length +
    searchResults.funds.length;

  const sectionedResults = useMemo(() => {
    const sectionedData = SECTIONS.map((section) => ({
      title: section.label,
      data: searchResults[section.value].slice(0, 2),
    })).filter((section) => section.data.length > 0);

    return sectionedData;
  }, [searchResults]);

  const renderItem: SectionListRenderItem<
    SearchResult,
    typeof sectionedResults[number]
  > = ({ item, section, ...rest }) => {
    switch (section.title) {
      case 'People':
        return renderUserItem({ item: item as User, ...rest });
      case 'Companies':
        return renderCompanyItem({ item: item as Company, ...rest });
      case 'Funds':
        return renderFundItem({ item: item as Fund, ...rest });
      case 'Posts':
        return renderPostItem({ item: item as Post, ...rest });
    }
    return <></>;
  };

  return (
    <View style={pStyles.globalContainer}>
      {!!search && (
        <Text style={styles.alert}>
          {totalResults} results for "{search}" in All
        </Text>
      )}
      <SectionList
        sections={sectionedResults}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>{title}</Text>
            <Pressable
              onPress={() => {
                NavigationService.navigate(title);
              }}>
              <Text style={styles.link}>View More</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

export default AllSearchResults;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 0,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  link: {
    color: PRIMARY,
    ...Body2Bold,
  },
  tagStyle: {
    paddingHorizontal: 15,
    marginRight: 8,
    borderRadius: 4,
  },
  tagLabel: {
    textTransform: 'none',
  },
  postButton: {
    position: 'absolute',
    bottom: 22,
    right: 22,
  },
  gradientContainer: {
    width: 56,
    height: 56,
    paddingVertical: 0,
  },
  postLabel: {
    fontSize: 40,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  filter: {
    ...Body2Bold,
    color: WHITE,
  },
  alert: {
    color: WHITE60,
    marginTop: 18,
    paddingHorizontal: 16,
  },
  listHeader: {
    backgroundColor: BLACK,
    borderColor: WHITE12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  listHeaderText: {
    color: WHITE,
    padding: 16,
    flex: 1,
    ...H6Bold,
  },
  body: {
    color: WHITE,
  },
});
