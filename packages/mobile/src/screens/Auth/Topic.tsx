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

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import { Body2, H6 } from '../../theme/fonts';
import { PRIMARY, WHITE, GRAY800, BLUE600 } from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';
import PGradientButton from '../../components/common/PGradientButton';
import { PostCategories } from 'backend/graphql/enumerations.graphql';

import type { TopicScreen } from 'mobile/src/navigations/AuthStack';
import CheckboxLabel from '../../components/common/CheckboxLabel';
import { showMessage } from '../../services/ToastService';
import PBackgroundImage from '../../components/common/PBackgroundImage';
const preferences = Object.keys(PostCategories);

const Topic: TopicScreen = ({ navigation }) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleNextPage = async (): Promise<void> => {
    if (selectedTopics.length < 3) {
      showMessage('error', 'Please select at least 3 topics.');
      return;
    }
    navigation.navigate('UserType', { topics: selectedTopics });
  };

  const handleSkip = (): void => {
    navigation.navigate('Authenticated');
  };

  const handleToggleCheck = (val: string): void => {
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
    <PBackgroundImage>
      <SafeAreaView style={styles.container}>
        <PHeader centerIcon={<LogoSvg />} />
        <PAppContainer style={styles.container}>
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
            label="NEXT"
            onPress={handleNextPage}
            btnContainer={styles.btnContainer}
          />
        </View>
      </SafeAreaView>
    </PBackgroundImage>
  );
};

export default Topic;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  txt: {
    ...H6,
    color: WHITE,
    marginTop: 17,
  },
  flatList: {
    flex: 1,
    marginTop: 18,
    paddingBottom: 80,
  },
  checkedWrap: {
    width: '100%',
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
