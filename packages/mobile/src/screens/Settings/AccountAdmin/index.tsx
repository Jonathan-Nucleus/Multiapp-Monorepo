import React, { FC } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { NavigationProp } from '@react-navigation/native';
import { CaretRight, CaretLeft, MagnifyingGlass } from 'phosphor-react-native';
import {
  BGDARK,
  GRAY2,
  GRAY100,
  WHITE,
  BLACK,
  PRIMARYSOLID7,
} from 'shared/src/colors';

import pStyles from '../../../theme/pStyles';
import { Body1, Body2, Body3 } from '../../../theme/fonts';
import PHeader from '../../../components/common/PHeader';

interface RenderItemProps {
  item: {
    label: string;
    onPress: () => void;
  };
}

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const AccountAdmin: FC<RouterProps> = ({ navigation }) => {
  const DATA = [
    {
      id: '11',
      label: 'Edit your profile',
      onPress: () => console.log(123),
    },
    {
      id: '21',
      label: 'Change your password',
      onPress: () => console.log(123),
    },
    {
      id: '1',
      label: 'Delete Account',
      onPress: () => console.log(123),
    },
  ];

  const renderListItem = ({ item }: RenderItemProps) => {
    return (
      <TouchableOpacity onPress={item.onPress}>
        <View style={[styles.item, styles.between]}>
          <Text style={styles.label}>{item.label}</Text>
          <CaretRight size={28} color={WHITE} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PHeader
        centerIcon={<Text style={styles.headerTitle}>Account Admin</Text>}
        containerStyle={styles.headerContainer}
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        rightIcon={<MagnifyingGlass size={28} color={WHITE} />}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => console.log(1231)}
      />
      <FlatList
        data={DATA}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />
    </SafeAreaView>
  );
};

export default AccountAdmin;

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
    justifyContent: 'space-between',
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
