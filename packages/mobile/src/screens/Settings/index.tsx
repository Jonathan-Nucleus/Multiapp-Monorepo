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
import { CaretRight } from 'phosphor-react-native';
import {
  BGDARK,
  GRAY2,
  GRAY100,
  WHITE,
  BLACK,
  PRIMARYSOLID7,
} from 'shared/src/colors';

import pStyles from '../../theme/pStyles';
import { Body1, Body2, Body3 } from '../../theme/fonts';
import Header from '../../components/main/Header';

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
  const DATA = [
    {
      id: '21',
      label: 'Account Admin',
      onPress: () => navigation.navigate('AccountAdmin'),
    },
    {
      id: '1',
      label: 'Preferences',
      onPress: () => navigation.navigate('SettingDetails'),
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
                headers: { Authorization: 'someAuthToken' },
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
    <SafeAreaView style={pStyles.globalContainer}>
      <Header navigation={navigation} />
      <FlatList
        data={DATA}
        ListHeaderComponent={renderListHeaderComponent}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
        numColumns={2}
        ListFooterComponent={
          <TouchableOpacity onPress={() => console.log(1)}>
            <View style={[styles.item, styles.between]}>
              <Text style={styles.label}>Logout</Text>
            </View>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: BGDARK,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    paddingTop: 0,
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    ...Body1,
    color: WHITE,
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
  logoutBtn: {
    marginTop: 50,
    borderRadius: 8,
    height: 48,
    backgroundColor: GRAY2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logout: {
    textAlign: 'center',
    color: GRAY100,
  },
  rightItem: {
    marginLeft: 8,
  },
});
