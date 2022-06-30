import React from 'react';
import { StyleSheet, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import { BLACK, GRAY800, WHITE12 } from 'shared/src/colors';
import { appWidth } from '../../utils/utils';

interface IProfilePlaceholderProps {
  variant: string;
}

const ProfilePlaceholder: React.FC<IProfilePlaceholderProps> = ({
  variant,
}) => (
  <View style={styles.container}>
    <SkeletonPlaceholder backgroundColor={WHITE12}>
      <SkeletonPlaceholder.Item height={65} />
      <SkeletonPlaceholder.Item
        width={56}
        height={56}
        borderRadius={variant === 'user' ? 28 : 2}
        backgroundColor={GRAY800}
        position="absolute"
        left={16}
        bottom={-28}
      />
      <SkeletonPlaceholder.Item
        height={8}
        marginTop={50}
        marginHorizontal={16}
        borderRadius={4}
        width="75%"
      />
      <SkeletonPlaceholder.Item
        height={8}
        marginTop={12}
        marginHorizontal={16}
        borderRadius={4}
        width="50%"
      />
      <SkeletonPlaceholder.Item
        height={18}
        marginTop={19}
        marginHorizontal={16}
        marginBottom={8}
        borderRadius={4}
      />
      <SkeletonPlaceholder.Item
        height={8}
        marginTop={50}
        marginHorizontal={16}
        borderRadius={4}
        width="45%"
      />
      <SkeletonPlaceholder.Item
        height={8}
        marginTop={8}
        marginHorizontal={16}
        borderRadius={4}
      />
      <SkeletonPlaceholder.Item
        height={8}
        marginTop={8}
        marginHorizontal={16}
        borderRadius={4}
        width="75%"
      />
      <SkeletonPlaceholder.Item
        marginHorizontal={16}
        marginTop={66}
        flexDirection="row"
        justifyContent="space-between">
        <SkeletonPlaceholder.Item
          width={appWidth * 0.45}
          height={40}
          borderRadius={32}
          borderColor={WHITE12}
          borderWidth={1}
          backgroundColor={BLACK}
        />
        <SkeletonPlaceholder.Item
          width={appWidth * 0.45}
          height={40}
          borderRadius={32}
          backgroundColor={WHITE12}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingHorizontal: 0,
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
  },
});

export default ProfilePlaceholder;
