import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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

  const content = (
    <View style={[styles.wrapper, viewStyle]}>
      {icon}
      <PLabel label={label} viewStyle={styles.labelWrapper} />
      {onPress ? <ArrowDownSvg /> : null}
    </View>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>
  ) : (
    content
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
    marginLeft: 8,
  },
  labelWrapper: {
    marginHorizontal: 8,
  },
});

export default PostSelection;
