import React, { FC, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Text,
  ListRenderItem,
} from 'react-native';
import Modal from 'react-native-modal';
import { Circle, RadioButton, XCircle } from 'phosphor-react-native';

import {
  BGDARK,
  BLACK,
  GRAY1,
  GRAY800,
  PRIMARY,
  PRIMARYSOLID,
  WHITE,
  WHITE12,
} from 'shared/src/colors';
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
}

const FilterModal: FC<ModalProps> = ({ isVisible, onClose, onFilter }) => {
  const [selectedTopics, setSelectedTopics] = useState<PostCategory[]>([]);
  const [selectedRole, setSelectedRole] = useState<PostRoleFilter>('EVERYONE');

  const toggleTopic = (categoryIndex: number): void => {
    let newValue = [...selectedTopics];

    const index = selectedTopics.indexOf(CATEGORY_OPTIONS[categoryIndex].value);
    index >= 0
      ? newValue.splice(index, 1)
      : newValue.push(CATEGORY_OPTIONS[categoryIndex].value);

    setSelectedTopics(newValue);
  };

  const renderRole: ListRenderItem<typeof ROLE_OPTIONS[number]> = ({
    item,
  }) => {
    return (
      <TouchableOpacity onPress={() => setSelectedRole(item.value)}>
        <View
          style={[
            styles.fromContainer,
            item.value === selectedRole && styles.selectedRole,
          ]}>
          {item.value === selectedRole ? (
            <RadioButton size={24} color={WHITE} weight="fill" />
          ) : (
            <Circle size={24} color={WHITE} />
          )}
          <Text style={styles.topic}>{item.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTopic: ListRenderItem<typeof CATEGORY_OPTIONS[number]> = ({
    item,
  }) => (
    <CheckboxLabel
      id={item.id}
      category={item.label}
      value={selectedTopics.includes(item.value)}
      handleChange={toggleTopic}
    />
  );

  return (
    <Modal
      isVisible={isVisible}
      swipeDirection="down"
      onBackdropPress={() => onClose()}
      style={styles.bottomHalfModal}
      propagateSwipe={true}
      backdropOpacity={0.5}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={onClose} style={styles.close}>
            <XCircle size={28} color={GRAY1} />
          </TouchableOpacity>
          <Text style={styles.title}>Customize Your Feed</Text>
        </View>
        <ScrollView>
          <View
            onStartShouldSetResponder={() => true}
            style={styles.flatContainer}>
            <FlatList
              data={ROLE_OPTIONS}
              keyExtractor={(item) => `role_${item.id}`}
              renderItem={renderRole}
              listKey="from"
              keyboardShouldPersistTaps="always"
              nestedScrollEnabled
              scrollEnabled={false}
              ListHeaderComponent={
                <Text style={styles.topic}>View Posts From:</Text>
              }
              ListHeaderComponentStyle={styles.listHeader}
            />
            <FlatList
              data={CATEGORY_OPTIONS}
              keyExtractor={(item) => `topic_${item.id}`}
              numColumns={2}
              renderItem={renderTopic}
              listKey="topic"
              keyboardShouldPersistTaps="always"
              nestedScrollEnabled
              scrollEnabled={false}
              ListHeaderComponent={<Text style={styles.topic}>Topics</Text>}
              ListHeaderComponentStyle={styles.listHeader}
              columnWrapperStyle={styles.column}
            />
          </View>
        </ScrollView>
        <View style={styles.bottom}>
          <PGradientOutlineButton
            label="done"
            onPress={() => {
              onClose();
              onFilter(selectedRole, selectedTopics);
            }}
            btnContainer={styles.button}
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
  likeCountLabel: {
    ...Body1Bold,
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: WHITE12,
  },
  modalKnobContainer: {
    alignItems: 'center',
  },
  modalKnob: {
    width: 72,
    height: 8,
    borderRadius: 30,
    backgroundColor: GRAY800,
  },
  title: {
    ...Body1Bold,
    color: WHITE,
  },
  flatContainer: { paddingHorizontal: 16 },
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
  listHeader: {
    marginVertical: 10,
    marginLeft: 12,
  },
  radioCircle: {
    width: 24,
    height: 24,
    fillColor: PRIMARY,
    borderColor: PRIMARY,
    borderWidth: 2,
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
