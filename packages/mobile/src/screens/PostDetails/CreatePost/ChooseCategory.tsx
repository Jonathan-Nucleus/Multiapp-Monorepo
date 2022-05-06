import React from 'react';
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
import {
  PostCategory,
  PostCategories,
} from 'mobile/src/graphql/mutation/posts';

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
      showBackground
      value={categoriesField.value.includes(item.value)}
      handleChange={handleChange}
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
});

export default ChooseCategory;
