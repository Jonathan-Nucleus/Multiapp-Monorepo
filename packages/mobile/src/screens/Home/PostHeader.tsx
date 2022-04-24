import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { GRAY800, WHITE } from 'shared/src/colors';
import PLabel from '../../components/common/PLabel';
import PHeader from '../../components/common/PHeader';
import RoundIcon from '../../components/common/RoundIcon';
import { Body1Bold } from '../../theme/fonts';
import { X } from 'phosphor-react-native';

interface PostHeaderProps {
  centerLabel: string;
  rightLabel: string;
  rightValidation: boolean;
  handleNext?: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = (props) => {
  const { centerLabel, rightLabel, rightValidation, handleNext } = props;
  const navigation = useNavigation();

  return (
    <PHeader
      leftIcon={
        <RoundIcon
          icon={<X size={20} color={WHITE} />}
          onPress={() => navigation.goBack()}
        />
      }
      leftStyle={styles.sideStyle}
      centerIcon={<PLabel label={centerLabel} textStyle={styles.headerTitle} />}
      rightIcon={
        <TouchableOpacity onPress={handleNext}>
          <PLabel
            label={rightLabel}
            textStyle={rightValidation ? styles.rightText : styles.disabledText}
          />
        </TouchableOpacity>
      }
      rightStyle={styles.sideStyle}
      containerStyle={styles.headerContainer}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 0,
    marginBottom: 0,
    height: 62,
  },
  headerTitle: {
    ...Body1Bold,
  },
  rightText: {
    ...Body1Bold,
    marginTop: 5,
  },
  disabledText: {
    ...Body1Bold,
    marginTop: 5,
    color: GRAY800,
  },
  sideStyle: {
    top: 10,
  },
});

export default PostHeader;
