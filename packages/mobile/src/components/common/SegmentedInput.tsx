import React, { ReactElement } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { FieldValues, Path, UseFormReturn, Controller } from 'react-hook-form';

import PLabel from 'mobile/src/components/common/PLabel';
import pStyles from 'mobile/src/theme/pStyles';
import { Body3 } from '../../theme/fonts';
import { WHITE, BLACK, DANGER } from 'shared/src/colors';

/**
 * Type definition describing props for the RatingControl component
 */
export interface SegmentedInputProps<TFieldValues extends FieldValues> {
  /** Ordered array of options */
  options: {
    title: string | ((selected: boolean) => React.ReactNode);
    value: string;
  }[];

  /** The name of this input field */
  name: Path<TFieldValues>;
  control: UseFormReturn<TFieldValues>['control'];
}

function SegmentedInput<TFieldValues extends FieldValues>({
  options,
  name,
  control,
}: SegmentedInputProps<TFieldValues>): ReactElement {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <>
          <View
            style={[
              styles.segmentsContainer,
              fieldState.error?.message ? styles.error : null,
            ]}>
            {options.map(({ title, value }, index) => (
              <Pressable
                key={value}
                onPress={() => field.onChange(value)}
                style={({ pressed }) => [
                  styles.button,
                  value === field.value ? styles.selected : null,
                  pressed ? pStyles.pressedStyle : null,
                ]}>
                {typeof title === 'string' ? (
                  <PLabel label={title} />
                ) : (
                  title(value === field.value)
                )}
              </Pressable>
            ))}
          </View>
          <Text style={[styles.errorMsg]}>
            {fieldState.error?.message ? fieldState.error.message : null}
          </Text>
        </>
      )}
    />
  );
}

export default SegmentedInput;

const styles = StyleSheet.create({
  button: {
    backgroundColor: BLACK,
    height: 48,
    color: WHITE,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: WHITE,
    color: BLACK,
  },
  segmentsContainer: {
    borderColor: WHITE,
    borderWidth: 1,
    borderRadius: 24,
    marginTop: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  error: {
    borderColor: DANGER,
  },
  errorMsg: {
    color: DANGER,
    ...Body3,
    marginBottom: 10,
    height: 12,
  },
});
