import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@apollo/client';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import { UPDATE_SETTINGS } from 'shared/graphql/mutation/account';
import { Body1, Body2 } from '../../theme/fonts';
import { PRIMARY, WHITE, GRAY800, BLUE600 } from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';
import PGradientButton from '../../components/common/PGradientButton';

import type { UserTypeScreen } from 'mobile/src/navigations/AuthStack';
import CheckboxLabel from '../../components/common/CheckboxLabel';
import { showMessage } from '../../services/ToastService';
import PBackgroundImage from '../../components/common/PBackgroundImage';
import { UserTypeEnum, UserTypeOptions } from 'backend/schemas/user';

const userTypes = Object.keys(UserTypeOptions);

const UserType: UserTypeScreen = ({ navigation, route }) => {
  const { topics } = route.params;
  const [selectedRole, setSelectedRole] = useState<UserTypeEnum[]>([]);
  const [updateSettings] = useMutation(UPDATE_SETTINGS);

  const handleNextPage = async (): Promise<void> => {
    if (selectedRole.length === 0) {
      showMessage('error', 'Please select at least 1 user type.');
      return;
    }
    try {
      const { data } = await updateSettings({
        variables: {
          settings: {
            interests: topics,
            userType: selectedRole[0],
          },
        },
      });

      if (data.updateSettings) {
        navigation.navigate('Authenticated');
        return;
      } else {
        showMessage('error', 'Something went wrong, Please try again later.');
      }
    } catch (e: any) {
      showMessage('error', e.message);
    }
  };

  const handleBack = (): void => {
    navigation.goBack();
  };

  const handleToggleCheck = (val: UserTypeEnum): void => {
    const _selectedRole = [...selectedRole];
    const findIndex: number = _selectedRole.indexOf(val);
    if (findIndex > -1) {
      _selectedRole.splice(findIndex, 1);
    } else {
      if (_selectedRole.length !== 0) {
        _selectedRole.splice(0, 1);
      }
      _selectedRole.push(val);
    }
    setSelectedRole(_selectedRole);
  };

  const renderListItem: ListRenderItem<typeof userTypes[number]> = ({
    item,
    index,
  }) => {
    return (
      <CheckboxLabel
        id={index}
        value={selectedRole.indexOf(item) > -1}
        handleChange={() => handleToggleCheck(item)}
        category={UserTypeOptions[item]}
        showBackground
        viewStyle={styles.checkedWrap}
      />
    );
  };

  return (
    <PBackgroundImage>
      <SafeAreaView style={styles.container}>
        <PHeader centerIcon={<LogoSvg />} />
        <PAppContainer style={styles.container}>
          <Text style={styles.txt}>
            {'Which of the following\nbest describes you?'}
          </Text>
          <FlatList
            data={userTypes}
            renderItem={renderListItem}
            keyExtractor={(item) => item}
            style={styles.flatList}
            nestedScrollEnabled
            scrollEnabled={false}
          />
        </PAppContainer>
        <View style={styles.bottom}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.hyperText}>Back</Text>
          </TouchableOpacity>
          <PGradientButton
            label="Finish"
            onPress={handleNextPage}
            btnContainer={styles.btnContainer}
          />
        </View>
      </SafeAreaView>
    </PBackgroundImage>
  );
};

export default UserType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  txt: {
    ...Body1,
    color: WHITE,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  flatList: {
    flex: 1,
    marginTop: 18,
    paddingBottom: 80,
  },
  checkedWrap: {
    width: '100%',
    marginBottom: 16,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 99,
    borderTopColor: GRAY800,
    borderTopWidth: 1,
    backgroundColor: BLUE600,
  },
  hyperText: {
    ...Body2,
    color: PRIMARY,
  },
  btnContainer: {
    width: 130,
    height: 40,
  },
});
