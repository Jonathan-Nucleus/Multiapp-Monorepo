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
import {
  CaretRight,
  CircleWavy,
  SlidersHorizontal,
  Gear,
  ShieldWarning,
  EnvelopeSimple,
  Lifebuoy,
} from 'phosphor-react-native';
import { AVATAR_URL, POST_URL } from 'react-native-dotenv';

import {
  GRAY2,
  GRAY100,
  WHITE,
  WHITE12,
  PRIMARYSOLID7,
  BGHEADER,
} from 'shared/src/colors';
import ShieldCheckSvg from 'shared/assets/images/shield-check.svg';

import MainHeader from '../../components/main/Header';
import PLabel from '../../components/common/PLabel';
import pStyles from '../../theme/pStyles';
import {
  Body1,
  Body2,
  Body3,
  H6,
  H6Bold,
  Body4Bold,
  Body2Bold,
} from '../../theme/fonts';
import { useAccount } from '../../graphql/query/account';
import Alsvg from 'shared/assets/images/al.svg';
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
  const { data } = useAccount();
  const account = data?.account;
  const MENU_ITEMS = [
    {
      id: '21',
      label: 'Accreditation',
      comment: 'You are accredited',
      onPress: () => navigation.navigate('AccountAdmin'),
      icon: <Alsvg />,
    },
    {
      id: '21',
      label: 'Account Admin',
      onPress: () => navigation.navigate('AccountAdmin'),
      icon: <Gear size={26} color={WHITE} />,
    },
    {
      id: '1',
      label: 'Preferences',
      onPress: () => navigation.navigate('Preferences'),
      icon: <SlidersHorizontal size={26} color={WHITE} />,
    },
    {
      id: '3',
      label: 'Help & Support',
      onPress: () => navigation.navigate('Help'),
      icon: <Lifebuoy size={26} color={WHITE} />,
    },
    {
      id: '2',
      label: 'Terms and Disclosures',
      onPress: () => navigation.navigate('Terms'),
      icon: <ShieldWarning size={26} color={WHITE} />,
    },
    {
      id: '2',
      label: 'Invite Your Friends',
      onPress: () => navigation.navigate('InviteFriends'),
      icon: <EnvelopeSimple size={26} color={WHITE} />,
    },
  ];

  const handleLogout = async () => {
    try {
      navigation.navigate('Auth');
      await clearToken();
    } catch (err) {
      console.log('logout err', err);
    }
  };

  const renderListItem = ({ item }: RenderItemProps) => {
    return (
      <TouchableOpacity onPress={item.onPress}>
        <View style={[styles.item, styles.between, styles.border]}>
          <View style={[styles.row, styles.alignCenter]}>
            {item.icon}
            <View style={styles.rightItem}>
              <Text style={styles.label}>{item.label}</Text>
              {item.comment && (
                <Text style={styles.comment}>{item.comment}</Text>
              )}
            </View>
          </View>

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
                uri: `${AVATAR_URL}/${account?.avatar}`,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.rightItem}>
              <View style={styles.row}>
                <Text style={styles.name}>
                  {account?.firstName} {account?.lastName}
                </Text>
                <View style={styles.proWrapper}>
                  <ShieldCheckSvg />
                  <PLabel label="PRO" textStyle={styles.proLabel} />
                </View>
              </View>
              <Text style={styles.comment}>See your profile</Text>
            </View>
          </View>
        </TouchableOpacity>
        {account?.companies.map((company) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('CompanySettings')}
            key={company._id}>
            <View style={[styles.item, styles.border]}>
              <FastImage
                style={styles.avatar}
                source={{
                  uri: `${AVATAR_URL}/${company?.avatar}`,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
              <View style={styles.rightItem}>
                <Text style={styles.name}>{company.name}</Text>
                <Text style={styles.comment}>See company page</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
        ListFooterComponent={
          <TouchableOpacity onPress={handleLogout}>
            <View style={[styles.item, styles.center]}>
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
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  border: {
    borderTopColor: WHITE12,
    borderTopWidth: 1,
  },

  commentWrap: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    ...Body2Bold,
    color: WHITE,
  },
  comment: {
    color: GRAY100,
    ...Body3,
    marginTop: 4,
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
    marginLeft: 16,
  },
  proWrapper: {
    flexDirection: 'row',
    marginLeft: 8,
    alignItems: 'center',
  },
  proLabel: {
    marginLeft: 8,
    ...Body4Bold,
    color: WHITE,
  },
  name: {
    ...H6Bold,
    color: WHITE,
  },
  center: {
    justifyContent: 'center',
  },
  alignCenter: {
    alignItems: 'center',
  },
});
