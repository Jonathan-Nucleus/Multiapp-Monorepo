import React, { FC } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  Linking,
} from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';
import { X } from 'phosphor-react-native';
import pStyles from 'mobile/src/theme/pStyles';
import LogoSvg from 'mobile/src/assets/icons/logo.svg';
import PText from 'mobile/src/components/common/PText';
import PGradientButton from 'mobile/src/components/common/PGradientButton';

import { WHITE, PRIMARY } from 'shared/src/colors';
import { Body1Bold, Body2Semibold } from 'mobile/src/theme/fonts';

interface UpdateModalProps {
  isVisible: boolean;
}

const UpdateModal: FC<UpdateModalProps> = ({ isVisible }) => {
  const goToAppStore = () => {
    Linking.openURL(
      'https://apps.apple.com/us/app/prometheus-alts/id1555304910',
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.9}
      animationInTiming={1}
      animationOutTiming={1}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.container, styles.flex]}>
          <LogoSvg />
          <PText style={styles.text}>
            We've made some important changes! Go to the{' '}
            <PText onPress={goToAppStore} style={styles.link}>
              App Store
            </PText>{' '}
            to get the latest and greatest version of Prometheus!
          </PText>
          <PGradientButton
            label="Update your App"
            gradientContainer={styles.button}
            textStyle={styles.buttonText}
            onPress={goToAppStore}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default UpdateModal;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: WHITE,
    marginTop: 28,
    marginBottom: 60,
    marginHorizontal: 8,
  },
  link: {
    textDecorationLine: 'underline',
  },
  button: {
    width: 320,
    height: 48,
  },
  buttonText: {
    ...Body2Semibold,
  },
});
