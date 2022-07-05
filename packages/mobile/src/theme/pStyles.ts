import { StyleSheet } from 'react-native';
import { BGDARK, BLACK, GRAY800 } from 'shared/src/colors';

const pStyles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    backgroundColor: BLACK,
  },
  modal: {
    backgroundColor: BGDARK,
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
  tooltipContainer: {
    width: 150,
  },
  tooltipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    elevation: 0,
    backgroundColor: 'black',
    marginTop: 16,
  },
  tooltipButtonText: {
    color: 'white',
  },
  tooltipText: {
    textAlign: 'center',
  },
  tooltipContent: {
    borderRadius: 15,
    padding: 16,
  },
  tooltipButtonOutline: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 30,
    elevation: 0,
    marginTop: 8,
  },
  tooltipButtonOutlineText: {
    color: 'black',
  },
});

export default pStyles;
