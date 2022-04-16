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

const companies = [
  {
    id: '123',
    company: {
      name: 'Good Soil Accelerated Opportunities L.P',
      type: 'Good Soil Investment',
      uri: 'https://unsplash.it/400/400?image=1',
    },
    user: {
      name: 'Emmet Peppers',
      type: 'pro',
      position: 'CEO',
      uri: 'https://unsplash.it/400/400?image=1',
    },
  },
  {
    id: '1235',
    company: {
      name: 'Good Soil Accelerated Opportunities L.P',
      type: 'Good Soil Investment',
      uri: 'https://unsplash.it/400/400?image=1',
    },
    user: {
      name: 'Emmet Peppers',
      type: 'pro',
      position: 'CEO',
      uri: 'https://unsplash.it/400/400?image=1',
    },
  },
];

const WatchList: React.FC<RouterProps> = ({ navigation }) => {
  const handleRemove = (id) => {
    console.log(id);
  };
  const renderListItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <FastImage
          style={styles.companyAvatar}
          source={{
            uri: 'https://unsplash.it/400/400?image=1',
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.flex}>
          <View style={styles.company}>
            <View style={styles.leftItem}>
              <Text style={styles.title}>{item.company.name}</Text>
              <Text style={styles.type}>{item.company.type}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item.id)}>
              <Star size={24} color={PRIMARYSOLID} weight="fill" />
            </TouchableOpacity>
          </View>
          <View style={styles.user}>
            <FastImage
              style={styles.userAvatar}
              source={{
                uri: item.user.uri,
              }}
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
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={pStyles.globalContainer}>
      <MainHeader navigation={navigation} />
      <FlatList
        data={companies}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
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
