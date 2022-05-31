import React, { useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { CaretLeft } from 'phosphor-react-native';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PTitle from 'mobile/src/components/common/PTitle';
import { Body2, H6Bold } from 'mobile/src/theme/fonts';
import MainHeader from 'mobile/src/components/main/Header';
import { useHelpRequest, HelpRequest } from 'shared/graphql/mutation/account';
import { useFunds } from 'shared/graphql/query/marketplace/useFunds';
import { BLACK, WHITE, GRAY600 } from 'shared/src/colors';
import EmailContact from './EmailContact';

import { ContactScreen } from 'mobile/src/navigations/AuthenticatedStack';

const Contact: ContactScreen = ({ navigation }) => {
  const { data } = useFunds();
  const [helpRequest] = useHelpRequest();

  const FUNDS = useMemo(() => {
    if (data?.funds && data?.funds?.length > 0) {
      return data?.funds?.map((v) => ({
        label: v.name,
        value: v._id,
      }));
    }
    return [];
  }, [data]);

  const handleContact = async (value: HelpRequest) => {
    try {
      const { data: requestData } = await helpRequest({
        variables: {
          request: value,
        },
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
      <PAppContainer contentContainerStyle={styles.flex}>
        <PTitle
          title="Contact fund specialist"
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
  flex: {
    flex: 1,
  },
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
