import React, { FC } from 'react';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import { SUCCESS, DANGER, BLUE400, WHITE, BLACK } from 'shared/src/colors';
import { Body2, Body2Semibold } from '../theme/fonts';
import { Check, WarningCircle, Info } from 'phosphor-react-native';
import ToastMessage, { ToastConfig } from 'react-native-toast-message';
import PText from '../components/common/PText';

const DEVICE_WIDTH = Dimensions.get('window').width;

export const toastConfig: ToastConfig = {
  error: ({ text1 }) => (
    <View style={[styles.toastContainer, styles.error]}>
      <WarningCircle size={18} color={WHITE} />
      <PText style={styles.message}>{text1}</PText>
    </View>
  ),
  success: ({ text1 }) => (
    <View style={[styles.toastContainer, styles.success]}>
      <Check size={18} color={BLACK} />
      <PText style={[styles.message, styles.successMessage]}>{text1}</PText>
    </View>
  ),
  info: ({ text1, text2 }) => (
    <View style={[styles.toastContainer, styles.info]}>
      <Info size={18} color={WHITE} />
      <View>
        {text1 && text1 !== 'Prometheus' ? (
          <PText style={styles.title}>{text1}</PText>
        ) : null}
        {text2 ? <PText style={styles.message}>{text2}</PText> : null}
      </View>
    </View>
  ),
};

const Toast: FC = () => {
  return <ToastMessage config={toastConfig} />;
};

export default Toast;

/**
 * @param title         The title of alert
 * @param description   The description of alert
 * @param type          The type of alert, one of success, error and info
 * @param callback      The callback after message is hidden
 * @param position      The position of showing message
 * @param offset        The offset from top & bottom of showing message
 */
export function showMessage(
  type: 'error' | 'success' | 'info',
  title: string,
  description?: string,
  callback?: () => void,
  position?: 'top' | 'bottom',
  offset?: number,
): void {
  // Based on figma design error's offset should be 32 + statusbar height, success offset should be 113
  const defaultOffset =
    type === 'error' ? StatusBar.currentHeight ?? 20 + 32 : 112;
  ToastMessage.show({
    type,
    text1: title,
    text2: description,
    onHide: callback,
    position: position,
    topOffset: offset ? offset : defaultOffset,
    bottomOffset: offset,
  });
}

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    minHeight: 54,
    width: DEVICE_WIDTH - 24,
    borderRadius: 8,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 12,
  },
  success: {
    backgroundColor: SUCCESS,
  },
  error: {
    backgroundColor: DANGER,
  },
  info: {
    backgroundColor: BLUE400,
  },
  title: {
    ...Body2Semibold,
    lineHeight: 18,
    marginLeft: 8,
    flexWrap: 'wrap',
    color: WHITE,
  },
  message: {
    ...Body2,
    lineHeight: 18,
    marginLeft: 8,
    flexWrap: 'wrap',
    color: WHITE,
  },
  successMessage: {
    color: BLACK,
  },
});
