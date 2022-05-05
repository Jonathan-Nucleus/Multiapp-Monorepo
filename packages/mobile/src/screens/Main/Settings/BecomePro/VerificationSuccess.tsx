import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { H6 } from 'mobile/src/theme/fonts';
import { BLACK, WHITE } from 'shared/src/colors';
import PGradientOutlineButton from 'mobile/src/components/common/PGradientOutlineButton';

interface VerificationSuccessProProps {
  navigation: NavigationProp<ParamListBase>;
}

const VerificationSuccess: React.FC<VerificationSuccessProProps> = ({
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thanks for applying!</Text>
      <View style={styles.bottom}>
        <PGradientOutlineButton
          label="Back to App"
          btnContainer={styles.btnContainer}
          onPress={() =>
            navigation.navigate('Main', {
              screen: 'Home',
            })
          }
        />
      </View>
    </View>
  );
};

export default VerificationSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  text: {
    color: WHITE,
    ...H6,
  },
  bottom: {
    position: 'absolute',
    bottom: 40,
  },
  btnContainer: {
    width: Dimensions.get('screen').width - 32,
  },
});
