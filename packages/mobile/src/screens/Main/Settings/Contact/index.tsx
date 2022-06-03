import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { CaretLeft } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PTitle from 'mobile/src/components/common/PTitle';
import { H6Bold } from 'mobile/src/theme/fonts';
import MainHeader from 'mobile/src/components/main/Header';
import { useHelpRequest, HelpRequest } from 'shared/graphql/mutation/account';
import { useFunds } from 'shared/graphql/query/marketplace/useFunds';
import { BLACK, WHITE } from 'shared/src/colors';
import EmailContact from './EmailContact';

import { ContactScreen } from 'mobile/src/navigations/AuthenticatedStack';

const Contact: ContactScreen = ({ navigation, route }) => {
  const { fundId } = route.params || {};

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

  const handleContact = async (value: HelpRequest): Promise<void> => {
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
    <SafeAreaView style={styles.container} edges={['bottom']}>
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
          initialFund={fundId}
        />
      </PAppContainer>
    </SafeAreaView>
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
});
