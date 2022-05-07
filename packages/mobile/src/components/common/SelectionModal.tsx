import React, { ReactElement } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Modal from 'react-native-modal';

import IconButton from './IconButton';
import PLabel from './PLabel';

import { BLACK, PRIMARYSOLID } from 'shared/src/colors';
import pStyles from '../../theme/pStyles';

export interface MenuDataItemProps<Key = string> {
  label: string;
  key: Key;
  icon: React.ReactNode;
}

interface SelectionModalProps<Key = string> {
  dataArray: MenuDataItemProps<Key>[];
  isVisible: boolean;
  buttonLabel: string;
  modalStyle?: StyleProp<ViewStyle>;
  onPressCancel?: () => void;
  onPressItem?: (key: MenuDataItemProps<Key>['key']) => void;
}

function SelectionModal<Key = string>(
  props: SelectionModalProps<Key>,
): ReactElement | null {
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
        <View style={pStyles.modalKnobContainer}>
          <View style={pStyles.modalKnob} />
        </View>
        <FlatList
          data={dataArray}
          keyExtractor={(item) => `${item.key}`}
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
}

export default SelectionModal;

const styles = StyleSheet.create({
  modalWrapper: {
    backgroundColor: BLACK,
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
    marginLeft: 16,
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
    backgroundColor: 'transparent',
  },
});
