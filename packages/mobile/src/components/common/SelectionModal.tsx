import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

import IconButton from './IconButton';
import PLabel from './PLabel';

import { GRAY3, PRIMARYSOLID, PRIMARYSOLID7 } from 'shared/src/colors';

export interface MenuDataItemProps {
  label: string;
  key: string;
  icon: React.ReactNode;
}

interface SelectionModalProps {
  dataArray: MenuDataItemProps[];
  isVisible: boolean;
  buttonLabel: string;
  modalStyle?: object;
  onPressCancel?: () => void;
  onPressItem?: (key: string) => void;
}

const SelectionModal: React.FC<SelectionModalProps> = (props) => {
  const {
    dataArray,
    isVisible,
    buttonLabel,
    modalStyle,
    onPressCancel,
    onPressItem,
  } = props;

  return (
    <Modal
      isVisible={isVisible}
      style={[styles.bottomHalfModal, modalStyle]}
      onBackdropPress={onPressCancel}>
      <View style={styles.modalWrapper}>
        <FlatList
          data={dataArray}
          keyExtractor={(item) => item.key.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const { label, icon, key } = item;
            return (
              <IconButton
                icon={icon}
                label={label}
                textStyle={styles.menuLabel}
                viewStyle={styles.menuItem}
                onPress={() => onPressItem && onPressItem(key)}
              />
            );
          }}
        />
        <TouchableOpacity onPress={onPressCancel} style={styles.doneBtn}>
          <PLabel label={buttonLabel} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SelectionModal;

const styles = StyleSheet.create({
  modalWrapper: {
    backgroundColor: GRAY3,
    paddingHorizontal: 28,
    paddingVertical: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomHalfModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  menuLabel: {
    marginLeft: 20,
  },
  menuItem: {
    marginLeft: 2,
    marginVertical: 12,
    justifyContent: 'flex-start',
  },
  doneBtn: {
    width: '100%',
    height: 45,
    marginTop: 24,
    borderRadius: 22,
    borderColor: PRIMARYSOLID,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARYSOLID7,
  },
});
