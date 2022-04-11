import React from 'react';
import { StyleSheet, Image, ImageURISource } from 'react-native';

interface RoundImageViewProps {
  imageStyle?: object;
  image: ImageURISource;
  size?: number;
}

const RoundImageView: React.FC<RoundImageViewProps> = (props) => {
  const { image, imageStyle, size = 64 } = props;
  const sizeStyles = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <Image source={image} style={[styles.wrapper, sizeStyles, imageStyle]} />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RoundImageView;
