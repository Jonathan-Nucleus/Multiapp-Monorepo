import React from 'react';
import { StyleSheet, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import PLabel from '../../components/common/PLabel';
import { PRIMARYOVERLAY } from 'shared/src/colors';

interface PostCategoryProps {
  id: number;
  value: boolean;
  category: string;
  viewStyle?: object;
  handleChange: (v: number) => void;
}

const PostCategory: React.FC<PostCategoryProps> = (props) => {
  const { id, category, value, viewStyle, handleChange } = props;

  return (
    <View style={[styles.wrapper, viewStyle]}>
      <CheckBox
        disabled={false}
        value={value}
        onValueChange={() => handleChange(id)}
      />
      <PLabel label={category} viewStyle={{ marginLeft: 8 }} />
    </View>
  );
};

export default PostCategory;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    marginBottom: 8,
    width: '45%',
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARYOVERLAY,
  },
});
