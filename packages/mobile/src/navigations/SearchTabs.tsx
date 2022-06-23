import React, { ReactElement, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabScreenProps,
} from '@react-navigation/material-top-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { X, MagnifyingGlass, CaretLeft } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PHeader from '../components/common/PHeader';
import SearchInput from '../components/common/SearchInput';
import { Body2, Body2Bold, Body3 } from '../theme/fonts';
import {
  BLACK,
  WHITE,
  PRIMARYSTATE,
  WHITE60,
  WHITE12,
} from 'shared/src/colors';

import AllSearchResults from '../screens/Search/All';
import Funds from '../screens/Search/Funds';
import People from '../screens/Search/People';
import Companies from '../screens/Search/Companies';
import Posts from '../screens/Search/Posts';

import type {
  AuthenticatedScreenProps,
  SearchScreen,
} from './AuthenticatedStack';
import { useGlobalSearch } from 'shared/graphql/query/search/useGlobalSearch';

const Tab = createMaterialTopTabNavigator();
const SearchTabs: SearchScreen = ({ navigation, route }) => {
  const [search, setSearch] = useState(route.params?.searchString ?? '');
  const { data: searchData } = useGlobalSearch(search);

  const initialRoute =
    search.startsWith('#') || search.startsWith('$') ? 'Posts' : 'All';

  return (
    <SafeAreaView style={styles.globalContainer} edges={['bottom']}>
      <PHeader
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        onPressLeft={() => navigation.goBack()}
        rightIcon={<View />}
        centerIcon={
          <SearchInput
            value={search}
            onChangeText={setSearch}
            onClear={() => setSearch('')}
          />
        }
      />
      <Tab.Navigator
        style={styles.globalContainer}
        screenOptions={({ route }) => ({
          tabBarStyle: styles.tabBar,
          tabBarScrollEnabled: true,
          tabBarIndicatorStyle: styles.tabBarIndicator,
          tabBarActiveTintColor: WHITE,
          tabBarInactiveTintColor: WHITE60,
          tabBarItemStyle: styles.tabBarItem,
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                Body2,
                styles.tabBarItem,
                { color },
                focused ? Body2Bold : {},
              ]}
              allowFontScaling={false}>
              {route.name}
            </Text>
          ),
        })}
        initialRouteName={initialRoute}>
        <Tab.Screen name="All">
          {() => (
            <AllSearchResults
              searchResults={
                searchData?.globalSearch || {
                  users: [],
                  companies: [],
                  posts: [],
                  funds: [],
                }
              }
              search={search}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="People">
          {() => (
            <People
              users={searchData?.globalSearch.users ?? []}
              search={search}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Companies">
          {() => (
            <Companies
              companies={searchData?.globalSearch.companies ?? []}
              search={search}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Posts">
          {() => (
            <Posts
              posts={searchData?.globalSearch.posts ?? []}
              search={search}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Funds">
          {() => (
            <Funds
              funds={searchData?.globalSearch.funds ?? []}
              search={search}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default SearchTabs;

export type SearchTabsParamList = {
  People: undefined;
  Companies: undefined;
  Posts: undefined;
  Funds: undefined;
};

export type SearchScreenProps<
  RouteName extends keyof SearchTabsParamList = keyof SearchTabsParamList,
> = CompositeScreenProps<
  MaterialTopTabScreenProps<SearchTabsParamList, RouteName>,
  AuthenticatedScreenProps
>;

export type PeopleScreen = (props: SearchScreenProps<'People'>) => ReactElement;

export type CompaniesScreen = (
  props: SearchScreenProps<'Companies'>,
) => ReactElement | null;

export type PostsScreen = (
  props: SearchScreenProps<'Posts'>,
) => ReactElement | null;

export type FundsScreen = (
  props: SearchScreenProps<'Funds'>,
) => ReactElement | null;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    backgroundColor: BLACK,
  },
  tabBar: {
    backgroundColor: BLACK,
    marginTop: 0,
    paddingTop: 0,
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
  },
  tabBarItem: {
    width: 105,
    textAlign: 'center',
  },
  tabBarIndicator: {
    backgroundColor: PRIMARYSTATE,
  },
  textInput: {
    ...Body3,
    color: WHITE,
    height: 34,
    borderColor: WHITE,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    flex: 1,
  },
  textContainer: {
    position: 'relative',
    flexDirection: 'row',
  },
  icon: {
    position: 'absolute',
    right: 28,
    height: 34,
    justifyContent: 'center',
  },
});
