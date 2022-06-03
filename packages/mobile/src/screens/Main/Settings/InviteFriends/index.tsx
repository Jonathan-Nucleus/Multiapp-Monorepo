import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CaretLeft } from 'phosphor-react-native';
import { WHITE } from 'shared/src/colors';
import Share from 'react-native-share';

import { useForm, DefaultValues, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PAppContainer from 'mobile/src/components/common/PAppContainer';
import MainHeader from 'mobile/src/components/main/Header';
import PTextInput from 'mobile/src/components/common/PTextInput';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import InvitationCoin from 'mobile/src/components/main/settings/InvitationCoin';
import User1Svg from 'mobile/src/assets/images/user1.svg';
import User2Svg from 'mobile/src/assets/images/user2.svg';
import User3Svg from 'mobile/src/assets/images/user3.svg';
import LampSvg from 'mobile/src/assets/images/lamp.svg';
import AddSvg from 'mobile/src/assets/images/add.svg';
import Avatar from '../../../../components/common/Avatar';
import pStyles from 'mobile/src/theme/pStyles';
import { Body1Bold, Body2, Body2Bold } from 'mobile/src/theme/fonts';

import { showMessage } from 'mobile/src/services/utils';
import { useAccountContext } from 'shared/context/Account';
import { useInvites } from 'shared/graphql/query/account/useInvites';
import { useInviteUser } from 'shared/graphql/mutation/account/useInviteUser';

import { InviteFriendsScreen } from 'mobile/src/navigations/MoreStack';

const MAX_INVITES = 10;

type FormValues = {
  email: string;
};

const schema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email('Invalid email')
      .required('Required')
      .default(''),
  })
  .required();

const InviteFriends: InviteFriendsScreen = ({ navigation }) => {
  const account = useAccountContext();
  const { data } = useInvites();
  const [inviteUser] = useInviteUser();

  const invitees = data?.account.invitees ?? [];

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: schema.cast(
      {},
      {
        assert: false,
        stripUnknown: true,
      },
    ) as DefaultValues<FormValues>,
  });

  const onSubmit = async ({ email }: FormValues): Promise<void> => {
    try {
      const { data: inviteUserData } = await inviteUser({
        variables: {
          email,
        },
      });

      if (inviteUserData?.inviteUser) {
        showMessage(
          'success',
          "Invitation successfully sent! Let your contact know it's on it's way!",
        );
        await Share.open({
          title: 'Join me on Prometheus Alts!',
          message: `Just sent an invite to Prometheus to your email at ${email}. Check it out!`,
          url: 'prometheusalts.com',
        }).catch(() => console.log('User did not share invite message'));
      } else {
        showMessage('error', 'Error sending invitation');
      }
    } catch (err: unknown) {
      console.log(err);
      err instanceof Error && showMessage('error', err.message);
    }
  };

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader
        onPressLeft={() => navigation.goBack()}
        leftIcon={<CaretLeft size={28} color={WHITE} />}
      />
      <PAppContainer>
        <View style={styles.avatarSections}>
          <User1Svg style={[styles.user1, styles.absolute]} />
          <User2Svg style={[styles.user2, styles.absolute]} />
          <LampSvg style={[styles.lamp, styles.absolute]} />
          <Avatar user={account} size={84} style={styles.avatarContainer} />
          <User3Svg style={[styles.user3, styles.absolute]} />
          <AddSvg style={[styles.add, styles.absolute]} />
        </View>
        <Text style={styles.description}>
          The power of Prometheus ratchets up with every intelligent, curious,
          thoughtful new voice in the conversation. So bring in a few contacts
          {"who'll"} bring their A-game. You’ll be their first contact.
        </Text>
        <Text style={styles.body1}>
          You have {10 - invitees.length} invites left!
        </Text>
        <Text style={styles.body2}>
          Share a code via email. Each code can only be used once.
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <PTextInput
              label=""
              labelStyle={styles.noHeight}
              subLabelStyle={styles.noHeight}
              placeholder="Enter an email..."
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              text={field.value ?? ''}
              error={fieldState.error?.message}
            />
          )}
        />
        <PGradientButton
          onPress={handleSubmit(onSubmit)}
          label="Share a Code"
          btnContainer={styles.btn}
          disabled={!isValid || invitees.length > MAX_INVITES}
        />
        <View style={styles.codeContainer}>
          {[...new Array(MAX_INVITES)].map((_, index) => (
            <View key={`invite-${index}`} style={styles.coin}>
              <InvitationCoin user={invitees[index]} />
            </View>
          ))}
        </View>
      </PAppContainer>
    </View>
  );
};

export default InviteFriends;

const styles = StyleSheet.create({
  description: {
    ...Body2,
    lineHeight: 20,
    color: WHITE,
    marginBottom: 10,
  },
  body1: {
    ...Body1Bold,
    marginVertical: 12,
    color: WHITE,
  },
  body2: {
    ...Body2Bold,
    color: WHITE,
    marginBottom: 16,
    lineHeight: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  coin: {
    flexBasis: '20%',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    marginBottom: 16,
  },
  noHeight: {
    height: 0,
  },
  avatarSections: {
    marginBottom: 50,
    width: '100%',
  },
  absolute: {
    position: 'absolute',
  },
  avatarContainer: {
    marginTop: 61,
    alignSelf: 'center',
  },
  user1: {
    top: 18,
    left: 16,
  },
  user2: {
    top: 97,
    left: 58,
  },
  lamp: {
    top: 39,
    left: 90,
  },
  user3: {
    top: 42,
    right: 62,
  },
  add: {
    top: 101,
    right: 14,
  },
});
