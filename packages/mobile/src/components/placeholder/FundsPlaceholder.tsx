import React from 'react';
import { StyleSheet, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import { GRAY800, WHITE12 } from 'shared/src/colors';

const FundsPlaceholder = () => (
  <View style={styles.container}>
    <SkeletonPlaceholder backgroundColor={WHITE12}>
      <SkeletonPlaceholder.Item height={65} />
      <SkeletonPlaceholder.Item
        width={56}
        height={56}
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
        height={1}
        marginTop={42}
        marginHorizontal={16}
        marginBottom={8}
      />
      <SkeletonPlaceholder.Item
        marginHorizontal={16}
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

export default FundsPlaceholder;
