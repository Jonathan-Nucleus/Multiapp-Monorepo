import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { GRAY600 } from 'shared/src/colors';

interface DateSeparatorProps {
  date: string;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  return (
    <View style={styles.dateContainer}>
      <View style={styles.line} />
      <Text style={styles.dateText}>{date}</Text>
      <View style={styles.line} />
    </View>
  );
};

export default DateSeparator;

const styles = StyleSheet.create({
  dateContainer: {
    height: 40,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    color: GRAY600,
    marginHorizontal: 20,
  },
  line: {
    width: '40%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: GRAY600,
  },
});
