import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SUCCESS, DANGER, BLUE400, WHITE } from 'shared/src/colors';
import { Body2, Body2Semibold } from '../theme/fonts';
import { Check, WarningCircle, Info } from 'phosphor-react-native';
import ToastMessage, { ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  error: ({ text1 }) => (
    <View style={[styles.toastContainer, styles.error]}>
      <WarningCircle size={18} color={WHITE} />
      <Text style={styles.message}>{text1}</Text>
    </View>
  ),
  success: ({ text1 }) => (
    <View style={[styles.toastContainer, styles.success]}>
      <Check size={18} color={WHITE} />
      <Text style={styles.message}>{text1}</Text>
    </View>
  ),
  info: ({ text1, text2 }) => (
    <View style={[styles.toastContainer, styles.info]}>
      <Info size={18} color={WHITE} />
      <View>
        {text1 && text1 !== 'Prometheus' ? (
          <Text style={styles.title}>{text1}</Text>
        ) : null}
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
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
 */
export function showMessage(
  type: 'error' | 'success' | 'info',
  title: string,
  description?: string,
  callback?: () => void,
): void {
  ToastMessage.show({
    type,
    text1: title,
    text2: description,
    onHide: callback,
  });
}

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    minHeight: 54,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
});
