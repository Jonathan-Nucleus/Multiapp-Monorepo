import React, { FC, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
  ListRenderItem,
} from 'react-native';
import Modal from 'react-native-modal';
import { Circle, RadioButton, XCircle } from 'phosphor-react-native';

import { BGDARK, BLACK, GRAY1, PRIMARYSOLID, WHITE } from 'shared/src/colors';
import { Body1Bold, Body2Bold } from '../../theme/fonts';
import { PostCategories } from 'backend/graphql/enumerations.graphql';
import type {
  PostCategory,
  PostRoleFilter,
} from 'backend/graphql/posts.graphql';
import { PostRoleFilterOptions } from 'backend/schemas/post';
import CheckboxLabel from '../../components/common/CheckboxLabel';
import PGradientOutlineButton from '../../components/common/PGradientOutlineButton';

export type FilterCategory = PostCategory | 'ALL';

const ROLE_OPTIONS = Object.keys(PostRoleFilterOptions).map(
  (option, index) => ({
    id: index,
    value: option,
    label: PostRoleFilterOptions[option].label,
  }),
);

const CATEGORY_OPTIONS = Object.keys(PostCategories).map((option, index) => ({
  id: index,
  value: option,
  label: PostCategories[option],
}));

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onFilter: (role: PostRoleFilter, categoies: PostCategory[]) => void;
  selectedCategories?: PostCategory[];
  role?: PostRoleFilter;
}

const FilterModal: FC<ModalProps> = ({
  isVisible,
  onClose,
  onFilter,
  selectedCategories,
  role,
}) => {
  const [selectedTopics, setSelectedTopics] = useState<PostCategory[]>([]);
  const [selectedRole, setSelectedRole] = useState<PostRoleFilter>('EVERYONE');

  useEffect(() => {
    setSelectedTopics(selectedCategories ?? []);
  }, [selectedCategories]);

  useEffect(() => {
    role && setSelectedRole(role);
  }, [role]);

  const toggleTopic = (categoryIndex: number): void => {
    const newValue = [...selectedTopics];

    const index = newValue.indexOf(CATEGORY_OPTIONS[categoryIndex].value);
    index >= 0
      ? newValue.splice(index, 1)
      : newValue.push(CATEGORY_OPTIONS[categoryIndex].value);

    setSelectedTopics(newValue.length > 0 ? newValue : []);
  };

  const renderTopic: ListRenderItem<typeof CATEGORY_OPTIONS[number]> = ({
    item,
  }) => (
    <CheckboxLabel
      id={item.id}
      category={item.label}
      showBackground
      value={selectedCategories?.includes(item.value) ? true : false}
      handleChange={toggleTopic}
    />
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => onClose()}
      style={styles.bottomHalfModal}
      coverScreen={true}
      propagateSwipe={true}
      scrollOffset={1}
      backdropOpacity={0.5}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={onClose} style={styles.close}>
            <XCircle size={28} color={GRAY1} />
          </TouchableOpacity>
          <Text style={styles.title}>Customize Your Feed</Text>
        </View>
        <FlatList
          data={CATEGORY_OPTIONS}
          style={styles.list}
          keyExtractor={(item) => `topic_${item.id}`}
          numColumns={2}
          renderItem={renderTopic}
          listKey="topic"
          keyboardShouldPersistTaps="always"
          ListHeaderComponent={
            <View>
              <Text style={styles.topic}>View Posts From:</Text>
              {ROLE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSelectedRole(option.value)}>
                  <View
                    style={[
                      styles.fromContainer,
                      option.value === selectedRole && styles.selectedRole,
                    ]}>
                    {option.value === selectedRole ? (
                      <RadioButton size={24} color={WHITE} weight="fill" />
                    ) : (
                      <Circle size={24} color={WHITE} />
                    )}
                    <Text style={styles.topic}>{option.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <Text style={styles.topic}>Topics</Text>
            </View>
          }
          columnWrapperStyle={styles.column}
        />
        <View style={styles.bottom}>
          <PGradientOutlineButton
            label="done"
            onPress={() => {
              onClose();
              onFilter(selectedRole, selectedTopics);
            }}
            btnContainerStyle={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  bottomHalfModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: BGDARK,
    height: Dimensions.get('screen').height,
    justifyContent: 'center',
  },
  title: {
    ...Body1Bold,
    color: WHITE,
  },
  list: {
    paddingHorizontal: 16,
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    elevation: 5,
    height: 84,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    marginBottom: 18,
    paddingTop: 40,
  },
  close: {
    position: 'absolute',
    left: 20,
    top: 50,
  },
  topic: {
    color: WHITE,
    ...Body2Bold,
    marginLeft: 8,
    marginVertical: 8,
  },
  selectedRole: {
    backgroundColor: PRIMARYSOLID,
  },
  fromContainer: {
    flex: 1,
    borderRadius: 32,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PRIMARYSOLID,
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  bottom: {
    backgroundColor: BLACK,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  button: { width: '80%' },
  column: { justifyContent: 'space-between' },
});
