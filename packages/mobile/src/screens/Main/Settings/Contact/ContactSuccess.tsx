import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { Body1, Body2, H6 } from 'mobile/src/theme/fonts';
import { BLACK, WHITE, WHITE60 } from 'shared/src/colors';
import PGradientOutlineButton from 'mobile/src/components/common/PGradientOutlineButton';
import PHeader from '../../../../components/common/PHeader';

interface ContactSuccessProProps {
  navigation: NavigationProp<ParamListBase>;
}

const ContactSuccess: React.FC<ContactSuccessProProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <PHeader
        centerIcon={<Text style={styles.title}>Contact Fund Specialist</Text>}
      />
      <View style={styles.content}>
        <View>
          <Text style={styles.text}>Thanks for your request!</Text>
          <Text style={styles.comment}>
            A member of our Wealth Management team will contact you.
          </Text>
        </View>
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
    </View>
  );
};

export default ContactSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  content: {
    flex: 1,
    backgroundColor: BLACK,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  title: {
    ...Body1,
    color: WHITE,
  },
  text: {
    color: WHITE,
    ...H6,
    textAlign: 'center',
  },
  comment: {
    ...Body2,
    color: WHITE60,
    textAlign: 'center',
    marginTop: 8,
  },
  bottom: {
    position: 'absolute',
    bottom: 40,
  },
  btnContainer: {
    width: Dimensions.get('screen').width - 32,
  },
});
