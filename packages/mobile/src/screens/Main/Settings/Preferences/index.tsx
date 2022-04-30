import React, { FC, useState } from 'react';
import {
  ListRenderItem,
  StyleSheet,
  FlatList,
  View,
  Text,
  Switch,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';

import { CaretLeft } from 'phosphor-react-native';

import { GRAY20, WHITE, GREEN, WHITE60 } from 'shared/src/colors';

import pStyles from 'mobile/src/theme/pStyles';
import { Body1Bold, Body2, Body2Bold, Body3 } from 'mobile/src/theme/fonts';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import MainHeader from 'mobile/src/components/main/Header';
import NotificationMethod from './NotificationMethod';
import Messages from './Messages';
import NotifyMe from './NotifyMe';

interface GeneralSetting {
  label1: string;
  label2?: string;
  toggleSwitch?: () => void;
  isEnabled?: boolean;
  id: number;
  value: boolean;
}

interface SelectedSetting {
  id: number;
  value: boolean;
}

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const GeneralSettings = [
  {
    label1: 'Allow tagging',
    label2:
      'If allowed, users my tag you in posts, comments and messages using the @mention feature.',
    value: false,
    id: 11,
  },
];

const Preferences: FC<RouterProps> = ({ navigation }) => {
  const [enabledList, setEnabledList] = useState<SelectedSetting[]>([]);

  const handleToggleSelect = (val: boolean, item: GeneralSetting) => {
    const _enabledList = [...enabledList];
    const objIndex = _enabledList.findIndex((v) => v.id === item.id);
    if (objIndex > -1) {
      _enabledList[objIndex].value = val;
    } else {
      _enabledList.push({
        id: item.id,
        value: val,
      });
    }

    setEnabledList(_enabledList);
  };

  const renderListItem: ListRenderItem<GeneralSetting> = ({ item }) => {
    return (
      <View style={styles.item}>
        <View style={styles.leftItem}>
          <Text style={styles.label}>{item.label1}</Text>
          <Text style={styles.comment}>{item.label2}</Text>
        </View>
        <Switch
          trackColor={{ false: GRAY20, true: GREEN }}
          ios_backgroundColor={GRAY20}
          onValueChange={(val) => handleToggleSelect(val, item)}
          value={enabledList.findIndex((v) => v.id === item.id && v.value) > -1}
        />
      </View>
    );
  };

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader
        leftIcon={
          <View style={styles.row}>
            <CaretLeft size={28} color={WHITE} />
            <Text style={styles.headerTitle}>Preferences</Text>
          </View>
        }
        onPressLeft={() => navigation.goBack()}
      />
      <PAppContainer>
        <View style={styles.listHeader}>
          <Text style={styles.title}>General</Text>
        </View>
        <FlatList
          data={GeneralSettings}
          renderItem={renderListItem}
          keyExtractor={(item, index) => `general${index}`}
          style={styles.flatList}
          listKey="general"
          nestedScrollEnabled
          scrollEnabled={false}
        />
        <Messages />
        <NotificationMethod />
        <NotifyMe />
      </PAppContainer>
    </View>
  );
};

export default Preferences;

const styles = StyleSheet.create({
  headerTitle: {
    ...Body1Bold,
    color: WHITE,
  },
  title: {
    ...Body2Bold,
    color: WHITE,
  },
  label: {
    ...Body2,
    color: WHITE,
  },
  comment: {
    color: WHITE60,
    ...Body3,
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 36,
  },
  leftItem: {
    marginRight: 10,
    flex: 1,
  },
  flatList: {
    flex: 1,
    borderRadius: 8,
  },
  listHeader: {
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
