import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';

import PLabel from './PLabel';
import PTitle from './PTitle';
import { GRAY3, PRIMARYSOLID } from 'shared/src/colors';

interface PModalProps {
  title: string;
  subTitle: string;
  isVisible: boolean;
  optionsData: RadioButtonProps[];
  modalStyle?: object;
  onPressDone?: () => void;
}

const PModal: React.FC<PModalProps> = (props) => {
  const { title, subTitle, isVisible, optionsData, modalStyle, onPressDone } =
    props;

  const [radioButtons, setRadioButtons] =
    useState<RadioButtonProps[]>(optionsData);

  const onPressRadioButton = (radioButtonsArray: RadioButtonProps[]) => {
    setRadioButtons(radioButtonsArray);
  };

  return (
    <Modal
      isVisible={isVisible}
      style={[styles.bottomHalfModal, modalStyle]}
      onBackdropPress={onPressDone}>
      <View>
        <PTitle
          title={title}
          subTitle={subTitle}
          textStyle={{ marginBottom: 20 }}
        />
        <RadioGroup
          radioButtons={radioButtons}
          onPress={onPressRadioButton}
          containerStyle={styles.radioGroupStyle}
        />
        <TouchableOpacity onPress={onPressDone} style={styles.doneBtn}>
          <PLabel label="DONE" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default PModal;

const styles = StyleSheet.create({
  modalContainer: {
    minHeight: 200,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  bottomHalfModal: {
    backgroundColor: GRAY3,
    justifyContent: 'flex-end',
    margin: 0,
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  radioGroupStyle: {
    marginVertical: 30,
  },
  doneBtn: {
    width: '100%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARYSOLID,
  },
});
