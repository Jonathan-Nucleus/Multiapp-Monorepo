import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

import PLabel from '../../../components/common/PLabel';
import PHeader from '../../../components/common/PHeader';

import { WHITE } from 'shared/src/colors';
import { Body1Bold } from '../../../theme/fonts';

import { CaretLeft, X } from 'phosphor-react-native';

interface PostHeaderProps {
  centerLabel: string;
  navigation?: NavigationProp<any, any>;
  handleBack?: () => void;
  handleNext?: () => void;
}

const AccreditationHeader: React.FC<PostHeaderProps> = (props) => {
  const { centerLabel, handleBack, handleNext } = props;

  return (
    <PHeader
      leftIcon={
        <TouchableOpacity style={styles.iconContainer} onPress={handleBack}>
          <CaretLeft size={24} color={WHITE} />
        </TouchableOpacity>
      }
      leftStyle={styles.sideStyle}
      centerIcon={<PLabel label={centerLabel} textStyle={styles.headerTitle} />}
      rightIcon={
        <TouchableOpacity style={styles.iconContainer} onPress={handleNext}>
          <X size={24} color={WHITE} />
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
  iconContainer: {
    padding: 8,
  },
  sideStyle: {
    top: 6,
  },
});

export default AccreditationHeader;
