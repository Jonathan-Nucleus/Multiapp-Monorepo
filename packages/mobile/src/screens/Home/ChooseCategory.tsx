import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PLabel from '../../components/common/PLabel';
import { WHITE60 } from 'shared/src/colors';
import pStyles from '../../theme/pStyles';
import CheckboxLabel from '../../components/common/CheckboxLabel';
import PostHeader from './PostHeader';
import PAppContainer from '../../components/common/PAppContainer';
import { ChooseCategoryScreen } from 'mobile/src/navigations/HomeStack';
import { PostCategory } from 'mobile/src/graphql/mutation/posts';

interface CategoryItem {
  id: number;
  txt: string;
  isChecked: boolean;
  value: PostCategory;
}

const CategoryList: CategoryItem[] = [
  { id: 1, txt: 'News', isChecked: false, value: 'NEWS' },
  { id: 2, txt: 'Tech', isChecked: false, value: 'TECH' },
  { id: 3, txt: 'Politics', isChecked: false, value: 'POLITICS' },
  { id: 4, txt: 'Energy', isChecked: false, value: 'ENERGY' },
  { id: 5, txt: 'Ideas', isChecked: false, value: 'IDEAS' },
  { id: 6, txt: 'Crypto', isChecked: false, value: 'CRYPTO' },
  { id: 7, txt: 'Education', isChecked: false, value: 'EDUCATION' },
];

const ChooseCategory: ChooseCategoryScreen = ({ route, navigation }) => {
  const [categories, setCategories] = useState(CategoryList);
  const [mentions, setMentions] = useState<string[]>([]);
  const [imageData, setImageData] = useState<object>({});
  const [description, setDescription] = useState('');

  useEffect(() => {
    const { description, mentions, imageData } = route.params;
    if (description && imageData) {
      setDescription(description);
      setMentions(mentions);
      setImageData(imageData);
    }
  }, [route, route.params]);

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
    <CheckboxLabel
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
    let updatedCategories: PostCategory[] = [];
    categories.map((category) => {
      if (category.isChecked) {
        updatedCategories.push(category.value);
      }
    });
    navigation.navigate('ReviewPost', {
      description,
      mentions,
      imageData,
      categories: updatedCategories,
    });
  };

  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PostHeader
        centerLabel="Choose Categories"
        rightLabel="NEXT"
        rightValidation={checkValidation()}
        handleNext={handleNext}
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
  catWrapper: {
    marginTop: 8,
    marginBottom: 32,
  },
  catLabel: {
    color: WHITE60,
  },
});

export default ChooseCategory;
