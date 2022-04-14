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
import { Body2, Body3 } from '../../theme/fonts';
import {
  GRAY400,
  WHITE,
  BGDARK,
  PINK,
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
        <View style={styles.company}>
          <View style={styles.leftItem}>
            <FastImage
              style={styles.companyAvatar}
              source={{
                uri: 'https://unsplash.it/400/400?image=1',
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.rightItem}>
              <Text style={styles.label}>{item.company.name}</Text>
              <Text style={styles.type}>{item.company.type}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleRemove(item.id)}>
            <Star size={28} color={PINK} weight="fill" />
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
    backgroundColor: BGDARK,
    marginVertical: 8,
  },
  company: {
    flexDirection: 'row',
    padding: 16,
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
  leftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 24,
  },
  rightItem: {
    marginLeft: 16,
    flex: 1,
  },
  label: {
    ...Body2,
    color: WHITE,
  },
  type: {
    color: GRAY400,
    ...Body3,
  },
  user: {
    flexDirection: 'row',
    borderTopColor: WHITE60,
    borderTopWidth: 1,
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
