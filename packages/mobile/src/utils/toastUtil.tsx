import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SUCCESS, BLACK } from 'shared/src/colors';
import { Body2 } from '../theme/fonts';
import { Check } from 'phosphor-react-native';
import { ToastConfigParams } from 'react-native-toast-message';

export const toastConfig = {
  /**
   * Probably, we can use this toast for all success types.
   * Anyway, let me leave this as `customizedSuccess` for now.
   * After reviewing PR, you can create a ticket to replace it with `success`
   */
  customizedSuccess: ({ text1 }: ToastConfigParams<any>) => (
    <View style={styles.cmSuccessContainer}>
      <Check size={18} color={BLACK} />
      <Text style={styles.text1Style}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  cmSuccessContainer: {
    flexDirection: 'row',
    height: 54,
    width: '100%',
    backgroundColor: SUCCESS,
    borderRadius: 8,
    alignItems: 'center',
    paddingLeft: 16,
  },
  text1Style: {
    ...Body2,
    marginLeft: 8,
  },
});
