import React from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { Star, ShieldCheck } from 'phosphor-react-native';
import FastImage from 'react-native-fast-image';

import Avatar from 'mobile/src/components/common/Avatar';
import MainHeader from 'mobile/src/components/main/Header';
import pStyles from 'mobile/src/theme/pStyles';
import { Body1Bold, Body2Bold, Body3 } from 'mobile/src/theme/fonts';
import {
  GRAY400,
  WHITE,
  BGDARK,
  PRIMARYSOLID,
  SUCCESS,
  WHITE60,
} from 'shared/src/colors';

import type { Fund } from 'backend/graphql/funds.graphql';
import { useWatchFund } from 'mobile/src/graphql/mutation/account';
import { useAccount } from 'mobile/src/graphql/query/account';

import { WatchlistScreen } from 'mobile/src/navigations/MainTabNavigator';
import { AVATAR_URL, BACKGROUND_URL } from 'react-native-dotenv';

const WatchList: WatchlistScreen = ({ navigation }) => {
  const { data: accountData, refetch } = useAccount();
  const [watchFund] = useWatchFund();
  const watchList = accountData?.account.watchlist ?? [];

  const handleRemoveWatchList = async (id: string): Promise<void> => {
    try {
      const { data } = await watchFund({
        variables: { watch: false, fundId: id },
      });
      if (data?.watchFund) {
        refetch();
      } else {
        console.log('err', data);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const navigateToFund = async (id: string): Promise<void> => {
    navigation.navigate('FundDetails', { fundId: id });
  };

  const renderListItem: ListRenderItem<typeof watchList[number]> = ({
    item,
  }) => {
    return (
      <TouchableOpacity onPress={() => navigateToFund(item._id)}>
        <View style={styles.item}>
          <View style={styles.fund}>
            <Avatar
              user={item.company}
              size={64}
              style={styles.companyAvatar}
            />
            <View style={[styles.flex, styles.company]}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.type}>{item.company.name}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveWatchList(item._id)}>
              <Star size={24} color={PRIMARYSOLID} weight="fill" />
            </TouchableOpacity>
          </View>
          <View style={styles.manager}>
            <Avatar user={item.manager} size={32} style={styles.userAvatar} />
            <View>
              <View style={[styles.flex, styles.name]}>
                <Text style={[styles.label]}>
                  {item.manager.firstName} {item.manager.lastName}
                </Text>
                {item.manager.role === 'PROFESSIONAL' ? (
                  <>
                    <ShieldCheck
                      size={16}
                      color={SUCCESS}
                      weight="fill"
                      style={styles.proBadge}
                    />
                    <Text style={[styles.label, styles.userType]}>PRO</Text>
                  </>
                ) : null}
              </View>
              <Text style={styles.type}>{item.manager.position}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={pStyles.globalContainer}>
      <MainHeader />
      <FlatList
        data={watchList}
        renderItem={renderListItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default WatchList;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'column',
    padding: 16,
    borderBottomColor: WHITE60,
    borderBottomWidth: 1,
    alignItems: 'flex-start',
  },
  fund: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  company: {
    flexDirection: 'column',
    marginLeft: 16,
  },
  manager: {
    marginTop: 16,
    marginLeft: 82,
    flexDirection: 'row',
  },
  companyAvatar: {
    borderRadius: 8,
  },
  userAvatar: {
    marginRight: 10,
  },
  name: {
    flexDirection: 'row',
  },
  proBadge: {
    marginLeft: 8,
  },
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  title: {
    ...Body1Bold,
    color: WHITE,
  },
  label: {
    ...Body2Bold,
    color: WHITE,
  },
  type: {
    color: GRAY400,
    ...Body3,
    marginTop: 8,
  },
  user: {
    flexDirection: 'row',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  userType: {
    marginLeft: 6,
  },
});
