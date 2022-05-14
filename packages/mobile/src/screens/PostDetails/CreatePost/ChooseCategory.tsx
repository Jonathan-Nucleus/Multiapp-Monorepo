import React, { useEffect, useState } from 'react';
import { ListRenderItem, StyleSheet, FlatList, View } from 'react-native';

import CheckboxLabel from 'mobile/src/components/common/CheckboxLabel';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PLabel from 'mobile/src/components/common/PLabel';
import { WHITE60 } from 'shared/src/colors';
import pStyles from 'mobile/src/theme/pStyles';

import PostHeader from './PostHeader';

import { useForm, DefaultValues, useController } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import type { ChooseCategoryScreen } from 'mobile/src/navigations/PostDetailsStack';
import { PostCategory, PostCategories } from 'shared/graphql/mutation/posts';

const CATEGORY_OPTIONS = Object.keys(PostCategories).map((option, index) => ({
  id: index,
  value: option,
  label: PostCategories[option],
}));

type FormValues = {
  categories: PostCategory[];
};

const schema = yup
  .object({
    categories: yup
      .array(
        yup.mixed().oneOf(Object.keys(PostCategories)).required().default(''),
      )
      .default([])
      .min(1)
      .max(3),
  })
  .required();

const ChooseCategory: ChooseCategoryScreen = ({ route, navigation }) => {
  const { categories = [] } = route.params;

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: schema.cast(
      { categories },
      { assert: false },
    ) as DefaultValues<FormValues>,
    mode: 'onChange',
  });

  const { field: categoriesField } = useController({
    name: 'categories',
    control,
  });
  const [disabled, setDisabled] = useState(false);

  const onSubmit = (values: FormValues): void => {
    navigation.navigate('ReviewPost', {
      ...route.params,
      categories: categoriesField.value,
    });
  };

  const handleChange = (categoryIndex: number): void => {
    const { value } = categoriesField;
    let newValue = [...value];

    const index = value.indexOf(CATEGORY_OPTIONS[categoryIndex].value);
    if (index >= 0) {
      newValue.splice(index, 1);
      if (newValue.length <= 2) {
        setDisabled(false);
      }
    } else {
      newValue.push(CATEGORY_OPTIONS[categoryIndex].value);
      if (newValue.length >= 3) {
        setDisabled(true);
      }
    }

    categoriesField.onChange(newValue);
  };

  const renderItem: ListRenderItem<typeof CATEGORY_OPTIONS[number]> = ({
    item,
  }) => (
    <CheckboxLabel
      id={item.id}
      category={item.label}
      showBackground
      value={categoriesField.value.includes(item.value)}
      handleChange={handleChange}
      disabled={disabled && !categoriesField.value.includes(item.value)}
    />
  );

  return (
    <View style={pStyles.globalContainer}>
      <PostHeader
        centerLabel="Choose Categories"
        rightLabel="NEXT"
        rightValidation={isValid}
        handleNext={handleSubmit(onSubmit)}
        handleBack={() => navigation.navigate('Main')}
      />
      <PAppContainer>
        <PLabel
          label="Select categories to make your post easier to find and visible to more people. Choose a max of 3."
          textStyle={styles.catLabel}
          viewStyle={styles.catWrapper}
        />
        <FlatList
          data={CATEGORY_OPTIONS}
          extraData={disabled}
          numColumns={2}
          renderItem={renderItem}
          columnWrapperStyle={styles.catList}
        />
      </PAppContainer>
    </View>
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
  catList: {
    justifyContent: 'space-between',
  },
});

export default ChooseCategory;
