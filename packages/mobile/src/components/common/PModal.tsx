import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

import PTitle from './PTitle';
import { BLACK, PRIMARYSOLID36 } from 'shared/src/colors';

interface PModalProps extends React.PropsWithChildren<unknown> {
  title?: string;
  subTitle?: string;
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
        <View style={styles.modalKnobContainer}>
          <View style={styles.modalKnob} />
        </View>
        {title && subTitle && (
          <PTitle
            title={title}
            subTitle={subTitle}
            textStyle={{ marginBottom: 20 }}
          />
        )}
        {children}
      </View>
    </Modal>
  );
};

export default PModal;

const styles = StyleSheet.create({
  modalWrapper: {
    backgroundColor: BLACK,
    paddingHorizontal: 28,
    paddingBottom: 32,
    paddingTop: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomHalfModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalKnobContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  modalKnob: {
    width: 72,
    height: 8,
    borderRadius: 30,
    backgroundColor: PRIMARYSOLID36,
  },
});
