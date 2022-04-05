import React from 'react';
import { StyleSheet, Image } from 'react-native';

interface RoundImageViewProps {
  image: number;
}

const RoundImageView: React.FC<RoundImageViewProps> = (props) => {
  const { image } = props;

  return <Image source={image} style={styles.wrapper} />;
};

const styles = StyleSheet.create({
  wrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RoundImageView;
