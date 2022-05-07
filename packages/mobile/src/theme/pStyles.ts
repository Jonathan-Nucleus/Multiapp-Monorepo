import { StyleSheet } from 'react-native';
import { BLACK, GRAY800 } from 'shared/src/colors';

const pStyles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    backgroundColor: BLACK,
  },
  pressedStyle: {
    opacity: 0.6,
  },
  modalKnobContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  modalKnob: {
    width: 72,
    height: 8,
    borderRadius: 30,
    backgroundColor: GRAY800,
  },
});

export default pStyles;
