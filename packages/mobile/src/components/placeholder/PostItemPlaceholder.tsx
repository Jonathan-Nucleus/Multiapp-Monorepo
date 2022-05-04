import React from 'react';
import { StyleSheet, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import { WHITE12 } from 'shared/src/colors';

const PostItemPlaceholder = () => (
  <View style={styles.container}>
    <SkeletonPlaceholder backgroundColor={WHITE12}>
      <SkeletonPlaceholder.Item
        alignItems="center"
        flexDirection="row"
        justifyContent="flex-start">
        <SkeletonPlaceholder.Item width={56} height={56} borderRadius={28} />
        <SkeletonPlaceholder.Item marginLeft={8}>
          <SkeletonPlaceholder.Item width={160} height={8} borderRadius={4} />
          <SkeletonPlaceholder.Item
            width={100}
            height={8}
            marginTop={4}
            borderRadius={4}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item height={8} marginTop={20} borderRadius={4} />
      <SkeletonPlaceholder.Item
        height={8}
        marginTop={12}
        borderRadius={4}
        width="75%"
      />
      <SkeletonPlaceholder.Item
        height={8}
        marginTop={12}
        marginBottom={32}
        borderRadius={4}
        width="80%"
      />
    </SkeletonPlaceholder>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
  },
});

export default PostItemPlaceholder;
