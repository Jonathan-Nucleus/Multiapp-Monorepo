import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PLabel from '../../components/common/PLabel';
import { GRAY800, WHITE60 } from 'shared/src/colors';
import { Body1 } from '../../theme/fonts';
import pStyles from '../../theme/pStyles';
import PostCategory from './PostCategory';
import PHeader from '../../components/common/PHeader';
import RoundIcon from '../../components/common/RoundIcon';

import BackSvg from '../../assets/icons/back.svg';
import PAppContainer from '../../components/common/PAppContainer';
import { ChooseCategoryScreen } from 'mobile/src/navigations/HomeStack';

interface CategoryItem {
  id: number;
  txt: string;
  isChecked: boolean;
}

const CategoryList: CategoryItem[] = [
  { id: 1, txt: 'News', isChecked: false },
  { id: 2, txt: 'Tech', isChecked: false },
  { id: 3, txt: 'Politics', isChecked: false },
  { id: 4, txt: 'Energy', isChecked: false },
  { id: 5, txt: 'Ideas', isChecked: false },
  { id: 6, txt: 'Crypto', isChecked: false },
  { id: 7, txt: 'Education', isChecked: false },
];

const ChooseCategory: ChooseCategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState(CategoryList);

  const handleChange = (id: number) => {
    const temp = categories.map((category) => {
      if (id === category.id) {
        return { ...category, isChecked: !category.isChecked };
      }
      return category;
    });
    setCategories(temp);
  };

  const renderItem = ({ item }: { item: CategoryItem }) => (
    <PostCategory
      id={item.id}
      category={item.txt}
      value={item.isChecked}
      handleChange={handleChange}
    />
  );

  const checkValidation = () => {
    let hasCategory;
    categories.forEach((category) => {
      if (category.isChecked) {
        hasCategory = true;
      }
    });

    if (!hasCategory) {
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!checkValidation()) {
      return;
    }
    let updatedCategories: string[] = [];
    categories.map((category) => {
      if (category.isChecked) {
        updatedCategories.push(category.txt.toUpperCase());
      }
    });
    navigation.navigate('CreatePost', { categories: updatedCategories });
  };

  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PHeader
        leftIcon={
          <RoundIcon icon={<BackSvg />} onPress={() => navigation.goBack()} />
        }
        centerIcon={
          <PLabel label="Choose Categories" textStyle={styles.headerTitle} />
        }
        rightIcon={
          <TouchableOpacity onPress={handleNext}>
            <PLabel
              label="NEXT"
              textStyle={
                checkValidation() ? styles.headerTitle : styles.disabledText
              }
            />
          </TouchableOpacity>
        }
        containerStyle={styles.headerContainer}
      />
      <PAppContainer>
        <PLabel
          label="Select categories to make your post easier to find and visible to more people."
          textStyle={styles.catLabel}
          viewStyle={styles.catWrapper}
        />
        <FlatList
          data={categories}
          numColumns={2}
          renderItem={renderItem}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      </PAppContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'space-between',
    paddingTop: 0,
    marginBottom: 0,
  },
  headerTitle: {
    ...Body1,
  },
  disabledText: {
    ...Body1,
    color: GRAY800,
  },
  catWrapper: {
    marginTop: 8,
    marginBottom: 32,
  },
  catLabel: {
    color: WHITE60,
  },
});

export default ChooseCategory;
