import React, { FC } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { NavigationProp } from '@react-navigation/native';
import { clearToken } from 'mobile/src/utils/auth-token';
import { CaretRight } from 'phosphor-react-native';
import {
  GRAY2,
  GRAY100,
  WHITE,
  PRIMARYSOLID7,
  BGHEADER,
} from 'shared/src/colors';

import MainHeader from '../../components/main/Header';
import pStyles from '../../theme/pStyles';
import { Body1, Body2, Body3, H6 } from '../../theme/fonts';

interface RenderItemProps {
  item: {
    label: string;
    onPress: () => void;
  };
}

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Settings: FC<RouterProps> = ({ navigation }) => {
  const MENU_ITEMS = [
    {
      id: '21',
      label: 'Account Admin',
      onPress: () => navigation.navigate('AccountAdmin'),
    },
    {
      id: '1',
      label: 'Preferences',
      onPress: () => navigation.navigate('Preferences'),
    },
    {
      id: '2',
      label: 'Terms and Disclosures',
      onPress: () => navigation.navigate('Terms'),
    },
    {
      id: '3',
      label: 'Help & Support',
      onPress: () => navigation.navigate('Help'),
    },
  ];

  const handleLogout = async () => {
    try {
      await clearToken();
      navigation.navigate('Auth');
    } catch (err) {
      console.log('logout err', err);
    }
  };

  const renderListItem = ({ item }: RenderItemProps) => {
    return (
      <TouchableOpacity onPress={item.onPress}>
        <View style={[styles.item, styles.renderItem, styles.between]}>
          <Text style={styles.label}>{item.label}</Text>
          <View>
            <CaretRight size={28} color={WHITE} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderListHeaderComponent = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileSettings')}>
          <View style={styles.item}>
            <FastImage
              style={styles.avatar}
              source={{
                uri: 'https://unsplash.it/400/400?image=1',
                headers: { Authorization: 'someAuthToken' },
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.rightItem}>
              <Text style={styles.label}>John Doe</Text>
              <Text style={styles.comment}>See your profile</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CompanySettings')}>
          <View style={styles.item}>
            <FastImage
              style={styles.avatar}
              source={{
                uri: 'https://unsplash.it/400/400?image=1',
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.rightItem}>
              <Text style={styles.label}>Cartenna Capital LP</Text>
              <Text style={styles.comment}>See company page</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('InviteFriends')}>
          <View style={[styles.item, styles.between]}>
            <Text style={styles.label}>Invite Your Friends</Text>
            <CaretRight size={28} color={WHITE} />
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader navigation={navigation} />
      <FlatList
        data={MENU_ITEMS}
        ListHeaderComponent={renderListHeaderComponent}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
        numColumns={2}
        ListFooterComponent={
          <TouchableOpacity onPress={handleLogout}>
            <View style={[styles.item, styles.between]}>
              <Text style={styles.label}>Log Out</Text>
            </View>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: PRIMARYSOLID7,
    marginTop: 16,
  },
  renderItem: {
    width: Dimensions.get('screen').width / 2 - 20,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: 68,
  },
  commentWrap: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    ...Body2,
    color: WHITE,
  },
  comment: {
    color: GRAY100,
    ...Body3,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  between: {
    justifyContent: 'space-between',
  },
  rightItem: {
    marginLeft: 8,
  },
});
