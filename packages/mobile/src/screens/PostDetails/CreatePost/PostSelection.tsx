import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import PLabel from 'mobile/src/components/common/PLabel';
import { PRIMARYSOLID, PRIMARYOVERLAY } from 'shared/src/colors';
import ArrowDownSvg from 'shared/assets/images/arrow-down.svg';

interface PostSelectionProps {
  icon: React.ReactNode;
  label: string;
  viewStyle?: object;
  onPress?: () => void;
}

const PostSelection: React.FC<PostSelectionProps> = (props) => {
  const { icon, label, viewStyle, onPress } = props;

  return (
    <TouchableOpacity style={[styles.wrapper, viewStyle]} onPress={onPress}>
      {icon}
      <PLabel label={label} viewStyle={styles.labelWrapper} />
      <ArrowDownSvg />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: PRIMARYOVERLAY,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PRIMARYSOLID,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  labelWrapper: {
    marginHorizontal: 8,
  },
});

export default PostSelection;
