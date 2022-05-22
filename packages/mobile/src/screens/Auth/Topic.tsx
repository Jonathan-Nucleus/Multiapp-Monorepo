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
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useMutation } from '@apollo/client';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTitle from '../../components/common/PTitle';
import ErrorText from '../../components/common/ErrorTxt';
import { UPDATE_SETTINGS } from 'shared/graphql/mutation/account';
import { Body2, H6 } from '../../theme/fonts';
import {
  BLACK,
  PRIMARY,
  WHITE,
  PRIMARYSOLID7,
  BLUE300,
} from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';
import CheckedSvg from '../../assets/icons/checked.svg';
import UncheckedSvg from '../../assets/icons/unchecked.svg';
import PGradientButton from '../../components/common/PGradientButton';
import { PostCategories } from 'backend/graphql/enumerations.graphql';

import type { TopicScreen } from 'mobile/src/navigations/AuthStack';
import CheckboxLabel from '../../components/common/CheckboxLabel';
const preferences = Object.keys(PostCategories);

const Topic: TopicScreen = ({ navigation }) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [updateSettings] = useMutation(UPDATE_SETTINGS);

  const handleNextPage = async (): Promise<void> => {
    if (selectedTopics.length < 3) {
      setError('Please select at least 3 topics');
      return;
    }
    try {
      const { data } = await updateSettings({
        variables: {
          settings: {
            interests: selectedTopics,
          },
        },
      });

      if (data.updateSettings) {
        navigation.navigate('Authenticated');
        return;
      } else {
        setError('Something went wrong, Please try again later');
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSkip = (): void => {
    navigation.navigate('Authenticated');
  };

  const handleToggleCheck = (val: string): void => {
    setError('');
    const _selectedTopics = [...selectedTopics];
    const findIndex: number = _selectedTopics.indexOf(val);
    if (findIndex > -1) {
      _selectedTopics.splice(findIndex, 1);
    } else {
      _selectedTopics.push(val);
    }
    setSelectedTopics(_selectedTopics);
  };

  const renderListItem: ListRenderItem<typeof preferences[number]> = ({
    item,
    index,
  }) => {
    return (
      <CheckboxLabel
        id={index}
        value={selectedTopics.indexOf(item) > -1}
        handleChange={() => handleToggleCheck(item)}
        category={PostCategories[item]}
        showBackground
        viewStyle={styles.checkedWrap}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <PHeader centerIcon={<LogoSvg />} />
      <PAppContainer>
        {!!error && <ErrorText error={error} />}
        <PTitle subTitle="One last thing..." />
        <Text style={styles.txt}>
          Select at least 3 topics to help us personalize your experience.
        </Text>
        <FlatList
          data={preferences}
          renderItem={renderListItem}
          keyExtractor={(item) => item}
          style={styles.flatList}
          nestedScrollEnabled
          scrollEnabled={false}
        />
      </PAppContainer>
      <View style={styles.bottom}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.hyperText}>SKIP</Text>
        </TouchableOpacity>
        <PGradientButton
          label="FINISH"
          onPress={handleNextPage}
          btnContainer={styles.btnContainer}
        />
      </View>
    </SafeAreaView>
  );
};

export default Topic;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  txt: {
    ...H6,
    color: WHITE,
    marginTop: 17,
  },
  flatList: {
    flex: 1,
    marginTop: 18,
    paddingBottom: 60,
  },
  checkedWrap: {
    width: '100%',
  },
  checkedTxt: {
    ...Body2,
    color: WHITE,
    marginLeft: 10,
  },
  bottom: {
    height: 80,
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BLUE300,
    width: '100%',
    zIndex: 99,
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
