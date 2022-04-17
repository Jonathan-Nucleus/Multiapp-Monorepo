import React from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { Star, ShieldCheck } from 'phosphor-react-native';
import FastImage from 'react-native-fast-image';
import type { Fund } from 'backend/graphql/funds.graphql';
import { useWatchFund } from '../../graphql/mutation/account';
import { useAccount } from '../../graphql/query/account';
import { AVATAR_URL, BACKGROUND_URL } from 'react-native-dotenv';

import MainHeader from '../../components/main/Header';
import pStyles from '../../theme/pStyles';
import { Body1Bold, Body2Bold, Body3 } from '../../theme/fonts';
import {
  GRAY400,
  WHITE,
  BGDARK,
  PRIMARYSOLID,
  SUCCESS,
  WHITE60,
} from 'shared/src/colors';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const WatchList: React.FC<RouterProps> = ({ navigation }) => {
  const { data: accountData, refetch } = useAccount();
  const [watchFund] = useWatchFund();
  const watchList: Fund[] = accountData?.account.watchlist ?? [];

  const handleRemoveWahchList = async (id: string): Promise<void> => {
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

  const renderListItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <FastImage
          style={styles.companyAvatar}
          source={{ uri: `${AVATAR_URL}/${item.company.avatar}` }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.flex}>
          <View style={styles.company}>
            <View style={styles.leftItem}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.type}>{item.company.name}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveWahchList(item._id)}>
              <Star size={24} color={PRIMARYSOLID} weight="fill" />
            </TouchableOpacity>
          </View>
          {/* <View style={styles.user}>
            <FastImage
              style={styles.userAvatar}
              source={{ uri: `${AVATAR_URL}/${item.avatar}` }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View>
              <Text style={styles.label}>{item.user.name}</Text>
              <Text style={styles.type}>{item.user.position}</Text>
            </View>
            <View style={styles.row}>
              <ShieldCheck size={16} color={SUCCESS} weight="fill" />
              <Text style={[styles.label, styles.userType]}>
                {item.user.type}
              </Text>
            </View>
          </View> */}
        </View>
      </View>
    );
  };
  return (
    <View style={pStyles.globalContainer}>
      <MainHeader navigation={navigation} />
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
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 16,
    borderBottomColor: WHITE60,
    borderBottomWidth: 1,
  },
  company: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
  },
  flex: { flex: 1 },
  leftItem: {
    flex: 1,
    marginRight: 8,
    marginLeft: 16,
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
