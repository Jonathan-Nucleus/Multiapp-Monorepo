import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { Star, ShieldCheck } from 'phosphor-react-native';

import Avatar from 'mobile/src/components/common/Avatar';
import MainHeader from 'mobile/src/components/main/Header';
import pStyles from 'mobile/src/theme/pStyles';
import { Body1Bold, Body2, Body2Bold, Body3 } from 'mobile/src/theme/fonts';
import {
  GRAY400,
  WHITE,
  PRIMARYSOLID,
  SUCCESS,
  WHITE10,
  WHITE12,
  WHITE87,
} from 'shared/src/colors';

import { useWatchFund } from 'mobile/src/graphql/mutation/funds/useWatchFund';
import { useAccount } from 'mobile/src/graphql/query/account';
import { WatchlistScreen } from 'mobile/src/navigations/MainTabNavigator';

interface SelectItemProps {
  id: string;
  name: string;
}

const WatchList: WatchlistScreen = ({ navigation }) => {
  const { data: accountData, refetch } = useAccount();
  const [watchFund] = useWatchFund();
  const [selectedItem, setSelectedItem] = useState<SelectItemProps | null>(
    null,
  );
  const [isWatched, setWatched] = useState(false);
  const watchList = accountData?.account.watchlist ?? [];

  useEffect(() => {
    if (!isWatched) {
      return;
    }
    const timer = setTimeout(() => setWatched(false), 5000);
    return () => clearTimeout(timer);
  }, [isWatched]);

  const handleRemoveWatchList = async (
    id: string,
    name: string,
  ): Promise<void> => {
    try {
      const { data } = await watchFund({
        variables: { watch: false, fundId: id },
      });
      if (data?.watchFund) {
        setSelectedItem({
          id,
          name,
        });
        setWatched(true);
        refetch();
      } else {
        console.log('err', data);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const handleAddWatchList = async (): Promise<void> => {
    if (!selectedItem) {
      return;
    }

    try {
      const { data } = await watchFund({
        variables: { watch: true, fundId: selectedItem.id },
      });
      if (data?.watchFund) {
        setWatched(false);
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
            <TouchableOpacity
              onPress={() => handleRemoveWatchList(item._id, item.name)}>
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
      {isWatched && (
        <View style={styles.undoContainer}>
          <Text style={styles.undoTxt}>
            You removed <Text style={styles.bold}>{selectedItem?.name}</Text>.
          </Text>
          <TouchableOpacity onPress={handleAddWatchList}>
            <Text style={styles.bold}>UNDO</Text>
          </TouchableOpacity>
        </View>
      )}

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
    borderBottomColor: WHITE12,
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
    textTransform: 'capitalize',
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
  undoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WHITE10,
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  undoTxt: {
    color: WHITE,
    ...Body2,
    marginRight: 10,
  },
  bold: {
    ...Body2Bold,
    color: WHITE,
  },
});
