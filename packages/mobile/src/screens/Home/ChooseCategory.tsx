import React, { useEffect, useState } from 'react';
import { ListRenderItem, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PLabel from '../../components/common/PLabel';
import { WHITE60 } from 'shared/src/colors';
import pStyles from '../../theme/pStyles';
import CheckboxLabel from '../../components/common/CheckboxLabel';
import PostHeader from './PostHeader';
import PAppContainer from '../../components/common/PAppContainer';

import type { ChooseCategoryScreen } from 'mobile/src/navigations/HomeStack';
import type { PostCategory } from 'mobile/src/graphql/mutation/posts';
import { PostCategories } from 'backend/graphql/enumerations.graphql';

import {
  useForm,
  DefaultValues,
  Controller,
  useController,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
      .array()
      .of(
        yup.string().oneOf(Object.keys(PostCategories)).required().default(''),
      )
      .default([])
      .min(1),
  })
  .required();

const ChooseCategory: ChooseCategoryScreen = ({ route, navigation }) => {
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: schema.cast(
      {},
      { assert: false },
    ) as DefaultValues<FormValues>,
    mode: 'onChange',
  });

  const { field: categoriesField } = useController({
    name: 'categories',
    control,
  });

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
    index >= 0
      ? newValue.splice(index, 1)
      : newValue.push(CATEGORY_OPTIONS[categoryIndex].value);

    categoriesField.onChange(newValue);
  };

  const renderItem: ListRenderItem<typeof CATEGORY_OPTIONS[number]> = ({
    item,
  }) => (
    <CheckboxLabel
      id={item.id}
      category={item.label}
      value={categoriesField.value.includes(item.value)}
      handleChange={handleChange}
    />
  );

  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PostHeader
        centerLabel="Choose Categories"
        rightLabel="NEXT"
        rightValidation={isValid}
        handleNext={handleSubmit(onSubmit)}
      />
      <PAppContainer>
        <PLabel
          label="Select categories to make your post easier to find and visible to more people."
          textStyle={styles.catLabel}
          viewStyle={styles.catWrapper}
        />
        <FlatList
          data={CATEGORY_OPTIONS}
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
