import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

import PTitle from './PTitle';
import { GRAY3 } from 'shared/src/colors';

interface PModalProps {
  title: string;
  subTitle: string;
  isVisible: boolean;
  modalStyle?: object;
  onPressDone?: () => void;
}

const PModal: React.FC<PModalProps> = (props) => {
  const { title, subTitle, isVisible, children, modalStyle, onPressDone } =
    props;

  return (
    <Modal
      isVisible={isVisible}
      style={[styles.bottomHalfModal, modalStyle]}
      onBackdropPress={onPressDone}>
      <View style={styles.modalWrapper}>
        <PTitle
          title={title}
          subTitle={subTitle}
          textStyle={{ marginBottom: 20 }}
        />
        {children}
      </View>
    </Modal>
  );
};

export default PModal;

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
});
