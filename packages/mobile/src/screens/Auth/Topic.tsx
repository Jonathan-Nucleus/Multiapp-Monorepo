import React, { useState } from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PTitle from '../../components/common/PTitle';
import { Body2, H6 } from '../../theme/fonts';
import { BGDARK, PRIMARY, WHITE, PRIMARYSOLID } from 'shared/src/colors';
import LogoSvg from '../../assets/icons/logo.svg';
import CheckedSvg from '../../assets/icons/checked.svg';
import UncheckedSvg from '../../assets/icons/unchecked.svg';
import PGradientButton from '../../components/common/PGradientButton';

const DATA = [
  {
    id: '1',
    label: 'News',
  },
  {
    id: '2',
    label: 'Politics',
  },
  {
    id: '3',
    label: 'Ideas',
  },
  {
    id: '4',
    label: 'Education',
  },
  {
    id: '1',
    label: 'News',
  },
  {
    id: '2',
    label: 'Politics',
  },
  {
    id: '3',
    label: 'Ideas',
  },
  {
    id: '4',
    label: 'Education',
  },
];

const Topic = ({ navigation }) => {
  const [checked, setChecked] = useState(false);

  const handleNextPage = () => {
    Keyboard.dismiss();
  };

  const handleSkip = () => {};

  const renderListItem = ({ item }) => {
    return (
      <View style={styles.checkedWrap}>
        <TouchableOpacity onPress={() => setChecked(!checked)}>
          {checked ? (
            <CheckedSvg width={16} height={16} />
          ) : (
            <UncheckedSvg width={16} height={16} />
          )}
        </TouchableOpacity>
        <Text style={styles.checkedTxt}>{item.label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <PHeader centerIcon={<LogoSvg />} />
      <PAppContainer>
        <PTitle subTitle="One last thing..." />
        <Text style={styles.txt}>
          Select at least 3 topics to help us personalize your experience.
        </Text>
        <FlatList
          data={DATA}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id}
          style={styles.flatList}
          nestedScrollEnabled
          scrollEnabled={false}
        />
      </PAppContainer>
      <View style={styles.bottom}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.hyperText}>SKIP</Text>
        </TouchableOpacity>
        <PGradientButton
          label="FINISH"
          onPress={handleNextPage}
          btnContainer={styles.btnContainer}
        />
      </View>
    </SafeAreaView>
  );
};

export default Topic;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGDARK,
  },
  txt: {
    ...H6,
    color: WHITE,
    marginTop: 17,
  },
  flatList: {
    flex: 1,
    marginTop: 18,
  },
  checkedWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 11,
    backgroundColor: PRIMARYSOLID,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 32,
  },
  checkedTxt: {
    ...Body2,
    color: WHITE,
    marginLeft: 10,
  },
  bottom: {
    height: 80,
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(84, 78, 253, 0.24)',
    width: '100%',
    zIndex: 99,
  },
  hyperText: {
    ...Body2,
    color: PRIMARY,
  },
  btnContainer: {
    width: 130,
    height: 40,
  },
});
