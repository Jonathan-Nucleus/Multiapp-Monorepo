import React, { FC, useState } from 'react';
import {
  ListRenderItem,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import Modal from 'react-native-modal';
import {
  CaretRight,
  CaretLeft,
  UserCircle,
  Key,
  Trash,
} from 'phosphor-react-native';
import { WHITE, DANGER, BLUE100 } from 'shared/src/colors';

import pStyles from 'mobile/src/theme/pStyles';
import {
  Body1,
  Body2,
  Body2Bold,
  Body3,
  Body1Bold,
} from 'mobile/src/theme/fonts';
import MainHeader from 'mobile/src/components/main/Header';
import { useAccount } from 'shared/graphql/query/account/useAccount';
import { useDeleteAccount } from 'shared/graphql/mutation/account';
import { clearToken } from 'mobile/src/utils/auth-token';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const AccountAdmin: FC<RouterProps> = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { data } = useAccount();
  const [deleteAccount] = useDeleteAccount();
  const account = data?.account;

  const handleDeleteAccount = async () => {
    setIsVisible(false);
    try {
      await deleteAccount();
      navigation.navigate('Auth');
      await clearToken();
    } catch (err) {
      console.log(err);
    }
  };

  const ACCOUNT_MENU_OPTIONS = [
    {
      id: 'edit_profile',
      label: 'Edit your profile',
      onPress: () =>
        navigation.navigate('UserDetails', {
          screen: 'UserProfile',
          params: {
            userId: account?._id,
          },
        }),
      icon: <UserCircle size={28} color={WHITE} />,
    },
    {
      id: 'change_pass',
      label: 'Change your password',
      onPress: () => navigation.navigate('ChangePass'),
      icon: <Key size={28} color={WHITE} />,
    },
    {
      id: 'delete_account',
      label: 'Delete Account',
      onPress: () => setIsVisible(true),
      icon: <Trash size={28} color={DANGER} />,
    },
  ];
  type AccountMenuOption = typeof ACCOUNT_MENU_OPTIONS[number];

  const renderListItem: ListRenderItem<AccountMenuOption> = ({ item }) => {
    return (
      <TouchableOpacity onPress={item.onPress}>
        <View style={[styles.item, styles.between]}>
          <View style={styles.row}>
            {item.icon}
            <Text
              style={[
                styles.label,
                item.id === 'delete_account' && styles.delete,
              ]}>
              {item.label}
            </Text>
          </View>

          <CaretRight
            size={28}
            color={item.id === 'delete_account' ? DANGER : WHITE}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader
        leftIcon={
          <View style={styles.row}>
            <CaretLeft size={28} color={WHITE} />
            <Text style={styles.headerTitle}>Account Admin</Text>
          </View>
        }
        onPressLeft={() => navigation.goBack()}
      />
      <FlatList
        data={ACCOUNT_MENU_OPTIONS}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />
      <Modal
        isVisible={isVisible}
        swipeDirection="down"
        onBackdropPress={() => setIsVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Are you sure you want to delete account?
          </Text>
          <Text style={styles.comment}>This cannot be undone.</Text>
          <View style={[styles.row, styles.between]}>
            <TouchableOpacity onPress={() => setIsVisible(false)}>
              <Text style={[styles.btnTxt, styles.cancel]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteAccount}>
              <Text style={[styles.btnTxt, styles.danger]}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AccountAdmin;

const styles = StyleSheet.create({
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
    marginTop: 16,
  },
  label: {
    ...Body2Bold,
    color: WHITE,
    marginLeft: 8,
  },
  between: {
    justifyContent: 'space-between',
  },
  delete: {
    color: DANGER,
  },
  modalContent: {
    backgroundColor: '#1D1D1D',
    paddingTop: 20,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  modalTitle: {
    textAlign: 'center',
    ...Body1Bold,
    color: WHITE,
  },
  btnTxt: {
    padding: 20,
    color: WHITE,
    ...Body1,
    textAlign: 'center',
    width: '100%',
  },
  danger: {
    color: DANGER,
  },
  comment: {
    ...Body2,
    color: WHITE,
    textAlign: 'center',
    marginTop: 8,
  },
  cancel: {
    color: BLUE100,
  },
});
