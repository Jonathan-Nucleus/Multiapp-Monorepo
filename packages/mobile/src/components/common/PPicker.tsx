import React, { useState } from 'react';
import {
  ListRenderItem,
  View,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
  StyleProp,
  TextStyle,
} from 'react-native';
import { CaretDown, Check } from 'phosphor-react-native';
import { Controller, ControllerProps } from 'react-hook-form';
import Modal from 'react-native-modal';

import PFormLabel from './PFormLabel';
import { Body1, Body2Bold, Body3 } from '../../theme/fonts';
import {
  WHITE,
  BGDARK,
  BLACK,
  GRAY600,
  GRAY900,
  DANGER,
} from 'shared/src/colors';

type Option = {
  label: string;
  value: string;
};

export interface PPickerProps<FieldValues>
  extends Omit<ControllerProps<FieldValues>, 'render' | 'as'> {
  options: Option[];
  label?: string;
  errorStyle?: StyleProp<TextStyle>;
}

const PPicker = function <FieldValues>({
  label,
  options,
  errorStyle,
  ...controllerProps
}: PPickerProps<FieldValues>): React.ReactElement {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label ? <PFormLabel label={label} textStyle={styles.label} /> : null}
      <Controller
        {...controllerProps}
        render={({ field, fieldState }) => {
          const selectItem = (value: string) => {
            field.onChange(value);
            setModalVisible(false);
          };

          const renderItem: ListRenderItem<Option> = ({ item }) => (
            <Pressable onPress={() => selectItem(item.value)}>
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>{item.label}</Text>
                <View style={styles.indicator}>
                  {item.value === field.value ? (
                    <Check size={24} color={WHITE} />
                  ) : null}
                </View>
              </View>
            </Pressable>
          );

          return (
            <>
              <Pressable onPress={() => setModalVisible(true)}>
                <View style={styles.valueContainer}>
                  <Text style={styles.controlValue} numberOfLines={1}>
                    {
                      options.find((option) => option.value === field.value)
                        ?.label
                    }
                  </Text>
                  <CaretDown size={14} color={WHITE} weight="fill" />
                </View>
              </Pressable>
              <Text style={[styles.error, errorStyle]}>
                {fieldState.error ? fieldState.error.message : null}
              </Text>
              <Modal isVisible={modalVisible} style={styles.modalStyle}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={options}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.value}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                  />
                </View>
              </Modal>
            </>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  valueContainer: {
    height: 40,
    backgroundColor: BGDARK,
    borderRadius: 8,
    borderColor: GRAY600,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  controlValue: {
    flex: 1,
    color: WHITE,
  },
  label: {
    ...Body2Bold,
    marginBottom: 4,
  },
  modalStyle: {
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
  },
  modalContent: {
    height: 250,
    paddingBottom: 16,
    backgroundColor: BLACK,
  },
  list: {
    flex: 1,
    borderRadius: 8,
    borderColor: WHITE,
    borderWidth: 1,
    backgroundColor: GRAY900,
  },
  listContent: {
    paddingVertical: 8,
  },
  listItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemText: {
    flex: 1,
    color: WHITE,
    ...Body1,
  },
  indicator: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: DANGER,
    ...Body3,
    marginBottom: 10,
    height: 12,
  },
});

export default PPicker;
