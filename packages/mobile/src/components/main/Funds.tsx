import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { LockKey } from 'phosphor-react-native';

import PGradientOutlineButton from 'mobile/src/components/common/PGradientOutlineButton';
import { WHITE, BLACK75, PRIMARY } from 'shared/src/colors';
import { Body2, Body2Bold } from 'mobile/src/theme/fonts';

import FundItem from './FundItem';
import type {
  FundSummary,
  Accredidation,
} from 'shared/graphql/fragments/fund';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';

interface FundProps {
  funds: FundSummary[];
  accredited: Accredidation;
}

const Funds: React.FC<FundProps> = ({ funds, accredited }) => {
  if (funds.length === 0) {
    return null;
  }

  return (
    <>
      <Text style={styles.name}>Funds</Text>
      {accredited !== 'NONE' ? (
        <FlatList
          data={funds}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <FundItem fund={item} />}
          scrollEnabled={false}
          nestedScrollEnabled
        />
      ) : (
        <View style={styles.content}>
          <View style={styles.row}>
            <View style={styles.icon}>
              <LockKey size={28} color={WHITE} />
            </View>
            <Text style={styles.text}>
              Only verified accredited investors can browse funds.
              <Text
                style={styles.more}
                onPress={() => Linking.openURL('https://prometheusalts.com/')}>
                {' '}
                More Info
              </Text>
            </Text>
          </View>
          <PGradientOutlineButton
            label="Verify Accredidation Status"
            onPress={() => NavigationService.navigate('Accreditation')}
          />
        </View>
      )}
    </>
  );
};

export default Funds;

const styles = StyleSheet.create({
  name: {
    color: WHITE,
    ...Body2Bold,
    paddingLeft: 16,
    marginBottom: 10,
  },
  content: {
    backgroundColor: BLACK75,
    paddingVertical: 25,
    paddingHorizontal: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  text: {
    color: WHITE,
    ...Body2,
  },
  more: {
    color: PRIMARY,
  },
  icon: {
    padding: 7,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#544EFD',
    marginRight: 16,
  },
});
