import React, { FC } from 'react';
import { StyleSheet, SafeAreaView, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import { X } from 'phosphor-react-native';

import pStyles from 'mobile/src/theme/pStyles';
import { BLACK, WHITE } from 'shared/src/colors';

interface FullScreenImageModalProps {
  url: string;
  isVisible: boolean;
  onClose: () => void;
}

const FullScreenImageModal: FC<FullScreenImageModalProps> = ({
  isVisible,
  url,
  onClose,
}) => {
  return (
    <Modal
      coverScreen={true}
      isVisible={isVisible}
      style={[styles.flex, styles.modal]}
      onBackdropPress={onClose}>
      <SafeAreaView style={styles.flex}>
        <FastImage
          source={{
            uri: url,
          }}
          style={styles.flex}
          resizeMode="contain"
        />
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [
            styles.closeButton,
            pressed ? pStyles.pressedStyle : null,
          ]}>
          <X color={WHITE} size={36} />
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};

export default FullScreenImageModal;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    position: 'relative',
  },
  modal: {
    backgroundColor: BLACK,
    padding: 0,
    margin: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 16,
  },
});
