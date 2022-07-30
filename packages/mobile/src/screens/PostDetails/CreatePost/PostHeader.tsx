import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { CaretLeft } from 'phosphor-react-native';

import PLabel from 'mobile/src/components/common/PLabel';
import PHeader from 'mobile/src/components/common/PHeader';
import { Body1Bold } from 'mobile/src/theme/fonts';
import pStyles from 'mobile/src/theme/pStyles';
import { GRAY800, WHITE } from 'shared/src/colors';

interface PostHeaderProps {
  leftIcon?: React.ReactNode;
  centerLabel: string;
  rightLabel: string;
  rightValidation: boolean;
  handleNext?: () => void;
  handleBack?: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = (props) => {
  const {
    leftIcon,
    centerLabel,
    rightLabel,
    rightValidation,
    handleNext,
    handleBack,
  } = props;

  return (
    <PHeader
      leftIcon={
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}>
          {leftIcon ? leftIcon : <CaretLeft size={32} color={WHITE} />}
        </Pressable>
      }
      centerIcon={<PLabel label={centerLabel} textStyle={styles.headerTitle} />}
      rightIcon={
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => (pressed ? pStyles.pressedStyle : null)}
          disabled={!rightValidation}>
          <PLabel
            label={rightLabel}
            textStyle={rightValidation ? styles.rightText : styles.disabledText}
          />
        </Pressable>
      }
    />
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    ...Body1Bold,
  },
  rightText: {
    ...Body1Bold,
  },
  disabledText: {
    ...Body1Bold,
    color: GRAY800,
  },
});

export default PostHeader;
