import React, { FC } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { NavigationProp } from '@react-navigation/native';
import { clearToken } from 'mobile/src/utils/auth-token';
import {
  CaretRight,
  SlidersHorizontal,
  Gear,
  ShieldWarning,
  EnvelopeSimple,
  Lifebuoy,
  Headset,
  ShieldCheck,
} from 'phosphor-react-native';
import { AVATAR_URL, POST_URL } from 'react-native-dotenv';

import { GRAY100, WHITE, WHITE12, SUCCESS } from 'shared/src/colors';

import MainHeader from '../../components/main/Header';
import PLabel from '../../components/common/PLabel';
import pStyles from '../../theme/pStyles';
import { Body3, H6Bold, Body4Bold, Body2Bold } from '../../theme/fonts';
import { useAccount } from '../../graphql/query/account';
import AIProSvg from 'shared/assets/images/al.svg';
import AIUserSvg from 'shared/assets/images/ai-user.svg';

interface RenderItemProps {
  item: {
    label: string;
    comment?: string;
    id: string;
    icon: any;
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
      id: 'accreditation',
      label: 'Accreditation',
      comment:
        account?.accreditation === 'ACCREDITED'
          ? 'You are accredited'
          : 'Verify Accreditation',
      onPress: () => navigation.navigate('Accreditation'),
      icon:
        account?.accreditation === 'ACCREDITED' ? <AIProSvg /> : <AIUserSvg />,
    },
    {
      id: 'Admin',
      label: 'Account Admin',
      onPress: () => navigation.navigate('AccountAdmin'),
      icon: <Gear size={26} color={WHITE} />,
    },
    {
      id: 'Preferences',
      label: 'Preferences',
      onPress: () => navigation.navigate('Preferences'),
      icon: <SlidersHorizontal size={26} color={WHITE} />,
    },
    {
      id: 'Support',
      label: 'Help & Support',
      onPress: () =>
        Linking.openURL('https://help.prometheusalts.com/hc/en-us'),
      icon: <Lifebuoy size={26} color={WHITE} />,
    },
    {
      id: 'Terms',
      label: 'Terms and Disclosures',
      onPress: () =>
        Linking.openURL('https://prometheusalts.com/legals/disclosure-library'),
      icon: <ShieldWarning size={26} color={WHITE} />,
    },
    {
      id: 'Invite',
      label: 'Invite Your Friends',
      onPress: () => navigation.navigate('InviteFriends'),
      icon: <EnvelopeSimple size={26} color={WHITE} />,
    },
  ];
  if (account?.role === 'PROFESSIONAL') {
    MENU_ITEMS.push({
      id: 'Contact',
      label: 'Contact Fund Specialist',
      onPress: () => navigation.navigate('Contact'),
      icon: <Headset size={26} color={WHITE} />,
    });
  } else {
    MENU_ITEMS.push({
      id: 'Become',
      label: 'Become a Verified Pro',
      onPress: () => navigation.navigate('BecomePro'),
      icon: <ShieldCheck size={26} color={WHITE} />,
    });
  }

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
          onPress={() =>
            navigation.navigate('UserProfile', { userId: data?.account._id })
          }>
          <View style={styles.item}>
            <FastImage
              style={styles.avatar}
              source={{
                uri: `${AVATAR_URL}/${account?.avatar}`,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.rightItem}>
              <View style={styles.row}>
                <Text style={styles.name}>
                  {account?.firstName} {account?.lastName}
                </Text>
                {account?.role === 'PROFESSIONAL' && (
                  <View style={styles.proWrapper}>
                    <ShieldCheck color={SUCCESS} weight="fill" />
                    <PLabel label="PRO" textStyle={styles.proLabel} />
                  </View>
                )}
              </View>
              <Text style={styles.comment}>See your profile</Text>
            </View>
          </View>
        </TouchableOpacity>

        {account?.companies.map((company) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CompanyProfile', { companyId: company._id })
            }
            key={company._id}>
            <View style={[styles.item, styles.border]}>
              <FastImage
                style={styles.companyAvatar}
                source={{
                  uri: `${AVATAR_URL}/${company?.avatar}`,
                }}
                resizeMode={FastImage.resizeMode.cover}
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
      <MainHeader />
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
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  companyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 4,
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
