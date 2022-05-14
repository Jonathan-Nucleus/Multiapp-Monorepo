import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { CaretLeft, PhoneCall, Envelope } from 'phosphor-react-native';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PTitle from 'mobile/src/components/common/PTitle';
import { Body2, H6Bold } from 'mobile/src/theme/fonts';
import MainHeader from 'mobile/src/components/main/Header';
import { useHelpRequest } from 'shared/graphql/mutation/account';
import { useFunds } from 'shared/graphql/query/marketplace/useFunds';
import { BLACK, WHITE, GRAY600 } from 'shared/src/colors';
import PhoneContact from './PhoneContact';
import EmailContact from './EmailContact';

interface ContactProps {
  navigation: NavigationProp<ParamListBase>;
}

type HelpRequestVariables = {
  request: {
    type: string;
    email?: string;
    phone?: string;
    fundId: string;
    message: string;
    preferredTimeOfDay?: string;
  };
};

const Contact: React.FC<ContactProps> = ({ navigation }) => {
  const [selectTab, setSelectTab] = useState('phone');
  const [helpRequest] = useHelpRequest();

  const { data } = useFunds();

  const FUNDS = useMemo(() => {
    if (data?.funds && data?.funds?.length > 0) {
      return data?.funds?.map((v) => ({
        label: v.name,
        value: v._id,
      }));
    }
    return [];
  }, [data]);

  const handleContact = async (value: HelpRequestVariables) => {
    try {
      const { data: requestData } = await helpRequest({
        variables: value,
      });
      if (requestData?.helpRequest) {
        navigation.navigate('ContactSuccess');
      }
    } catch (e) {
      console.error('contact error', e);
    }
  };

  return (
    <View style={styles.container}>
      <MainHeader
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        onPressLeft={() => navigation.goBack()}
      />
      <PAppContainer>
        <PTitle
          title="Choose a fund specialist"
          style={styles.textContainer}
          textStyle={styles.title}
        />
        <EmailContact
          handleContact={(val) => handleContact(val)}
          funds={FUNDS}
        />
      </PAppContainer>
    </View>
  );
};

export default Contact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  textContainer: {
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 26,
  },
  title: {
    ...H6Bold,
    color: WHITE,
  },
  tabContainer: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    marginBottom: 32,
  },
  phoneTab: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    borderColor: GRAY600,
    borderWidth: 1,
    width: Dimensions.get('screen').width / 2 - 16,
    flexDirection: 'row',
  },
  emailTab: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    borderColor: GRAY600,
    borderWidth: 1,
    width: Dimensions.get('screen').width / 2 - 16,
    flexDirection: 'row',
  },
  selectedTab: {
    backgroundColor: WHITE,
  },
  text: {
    ...Body2,
    color: WHITE,
    marginLeft: 6,
  },
  selectedTxt: {
    color: BLACK,
  },
});
