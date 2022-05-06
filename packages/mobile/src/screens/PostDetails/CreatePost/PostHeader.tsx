import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'phosphor-react-native';

import PLabel from 'mobile/src/components/common/PLabel';
import PHeader from 'mobile/src/components/common/PHeader';
import RoundIcon from 'mobile/src/components/common/RoundIcon';
import { Body1Bold } from 'mobile/src/theme/fonts';
import { GRAY800, WHITE } from 'shared/src/colors';

interface PostHeaderProps {
  centerLabel: string;
  rightLabel: string;
  rightValidation: boolean;
  handleNext?: () => void;
  handleBack?: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = (props) => {
  const { centerLabel, rightLabel, rightValidation, handleNext, handleBack } =
    props;

  return (
    <PHeader
      leftIcon={
        <RoundIcon icon={<X size={20} color={WHITE} />} onPress={handleBack} />
      }
      centerIcon={<PLabel label={centerLabel} textStyle={styles.headerTitle} />}
      rightIcon={
        <TouchableOpacity onPress={handleNext}>
          <PLabel
            label={rightLabel}
            textStyle={rightValidation ? styles.rightText : styles.disabledText}
          />
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 0,
    marginBottom: 0,
  },
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
  sideStyle: {},
});

export default PostHeader;
