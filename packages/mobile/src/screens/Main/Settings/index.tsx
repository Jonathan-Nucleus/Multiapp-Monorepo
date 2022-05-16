import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Linking,
} from 'react-native';
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
import { CommonActions } from '@react-navigation/native';

import { GRAY100, WHITE, WHITE12, SUCCESS } from 'shared/src/colors';

import Avatar from 'mobile/src/components/common/Avatar';
import MainHeader from 'mobile/src/components/main/Header';
import PLabel from 'mobile/src/components/common/PLabel';
import pStyles from 'mobile/src/theme/pStyles';
import { Body3, H6Bold, Body4Bold, Body2Bold } from 'mobile/src/theme/fonts';
import { useAccount } from 'shared/graphql/query/account/useAccount';
import AIUserSvg from 'shared/assets/images/ai-user.svg';
import QPSvg from 'shared/assets/images/QP.svg';
import QCSvg from 'shared/assets/images/QC.svg';
import AISvg from 'shared/assets/images/AI.svg';

import { SettingsScreen } from 'mobile/src/navigations/MoreStack';

interface RenderItemProps {
  item: {
    label: string;
    comment?: string;
    id: string;
    icon: any;
    disabled?: boolean;
    onPress: (() => void) | undefined;
  };
}

const Settings: SettingsScreen = ({ navigation }) => {
  const { data } = useAccount();
  const account = data?.account;
  const isAccredited = account?.accreditation !== 'NONE';
  const MENU_ITEMS = [
    {
      id: 'accreditation',
      label: 'Accreditation',
      comment: isAccredited ? 'You are accredited!' : 'Verify Accreditation',
      onPress: !isAccredited
        ? () => navigation.navigate('AccreditationStack')
        : undefined,
      icon:
        account?.accreditation === 'ACCREDITED' ? (
          <AISvg width={26} height={26} />
        ) : account?.accreditation === 'QUALIFIED_CLIENT' ? (
          <QCSvg width={26} height={26} />
        ) : account?.accreditation === 'QUALIFIED_PURCHASER' ? (
          <QPSvg width={26} height={26} />
        ) : (
          <AIUserSvg />
        ),
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
      disabled: true,
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
  if (account?.accreditation !== 'NONE') {
    MENU_ITEMS.push({
      id: 'Contact',
      label: 'Contact Fund Specialist',
      onPress: () => navigation.navigate('Contact'),
      icon: <Headset size={26} color={WHITE} />,
    });
  }
  if (account?.role === 'USER') {
    MENU_ITEMS.push({
      id: 'Become',
      label: 'Become a Verified Pro',
      onPress: () => navigation.navigate('BecomePro'),
      icon: <ShieldCheck size={26} color={WHITE} />,
    });
  }

  const handleLogout = async () => {
    try {
      clearToken();
      navigation.replace('Auth');
    } catch (err) {
      console.log('logout err', err);
    }
  };

  const renderListItem = ({ item }: RenderItemProps) => {
    return (
      <Pressable
        onPress={item.onPress}
        style={({ pressed }) => [
          pressed && item.onPress ? pStyles.pressedStyle : null,
        ]}>
        <View
          style={[
            styles.item,
            styles.between,
            styles.border,
            item.disabled ? styles.disabled : {},
          ]}>
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
      </Pressable>
    );
  };

  const renderListHeaderComponent = () => {
    if (!account) {
      return <></>;
    }

    return (
      <>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('UserDetails', {
              screen: 'UserProfile',
              params: { userId: account._id },
            })
          }>
          <View style={styles.item}>
            <Avatar user={account} size={60} />
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
              navigation.navigate('CompanyDetails', {
                screen: 'CompanyProfile',
                params: { companyId: company._id },
              })
            }
            key={company._id}>
            <View style={[styles.item, styles.border]}>
              <Avatar
                user={{ avatar: company.avatar }}
                size={60}
                style={styles.companyAvatar}
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
  companyAvatar: {
    borderRadius: 4,
  },
  between: {
    justifyContent: 'space-between',
  },
  rightItem: {
    flex: 1,
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
    textTransform: 'capitalize',
  },
  center: {
    justifyContent: 'center',
  },
  alignCenter: {
    alignItems: 'center',
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
