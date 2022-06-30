import React, { useState, useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { X } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import RadioGroup, { Option } from 'react-native-radio-button-group';
import {
  MentionInput,
  MentionSuggestionsProps,
} from 'react-native-controlled-mentions';

import UserSvg from 'shared/assets/images/user.svg';
import GlobalSvg from 'shared/assets/images/global.svg';
import AISvg from 'shared/assets/images/AI.svg';
import QPSvg from 'shared/assets/images/QP.svg';
import QCSvg from 'shared/assets/images/QC.svg';

import Avatar from 'mobile/src/components/common/Avatar';
import PLabel from 'mobile/src/components/common/PLabel';
import PModal from 'mobile/src/components/common/PModal';
import RoundIcon from 'mobile/src/components/common/RoundIcon';
import PostHeader from './CreatePost/PostHeader';
import PostSelection from './CreatePost/PostSelection';
import SharePostItem from 'mobile/src/components/main/posts/SharePostItem';
import ExpandingInput, {
  User,
  OnSelectUser,
} from 'mobile/src/components/common/ExpandingInput';
import MentionsList from 'mobile/src/components/main/MentionsList';
import { showMessage } from 'mobile/src/services/ToastService';
import pStyles from 'mobile/src/theme/pStyles';
import {
  WHITE60,
  PRIMARY,
  PRIMARYSOLID,
  WHITE,
  WHITE12,
  BLACK,
} from 'shared/src/colors';

import {
  useForm,
  DefaultValues,
  Controller,
  useController,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAccount } from 'shared/graphql/query/account/useAccount';
import { usePost } from 'shared/graphql/query/post/usePost';
import { useSharePost } from 'shared/graphql/mutation/posts/useSharePost';
import type { Audience } from 'shared/graphql/query/post/usePosts';

import { SharePostScreen } from 'mobile/src/navigations/PostDetailsStack';

const RadioBodyView = (props: any) => {
  const { icon, label } = props;
  return (
    <View style={styles.radioBodyWrapper}>
      {icon}
      <PLabel label={label} viewStyle={styles.radioBodyTextStyle} />
    </View>
  );
};

export const AUDIENCE_OPTIONS: Option<Audience>[] = [
  {
    id: 'EVERYONE',
    value: 'Everyone',
    labelView: (
      <RadioBodyView
        icon={<GlobalSvg width={24} height={24} />}
        label="Everyone"
      />
    ),
  },
  {
    id: 'ACCREDITED',
    value: 'Accredited Investors',
    labelView: (
      <RadioBodyView
        icon={<AISvg width={24} height={24} />}
        label="Accredited Investors"
      />
    ),
  },
  {
    id: 'QUALIFIED_PURCHASER',
    value: 'Qualified Purchasers',
    labelView: (
      <RadioBodyView
        icon={<QPSvg width={24} height={24} />}
        label="Qualified Purchasers"
      />
    ),
  },
  {
    id: 'QUALIFIED_CLIENT',
    value: 'Qualified Clients',
    labelView: (
      <RadioBodyView
        icon={<QCSvg width={24} height={24} />}
        label="Qualified Clients"
      />
    ),
  },
];

type FormValues = {
  userId: string;
  body: string;
  mentionIds: string[];
};

const schema = yup
  .object({
    userId: yup.string().required('Required'),
    body: yup.string().required().default(''),
    mentionIds: yup
      .array()
      .of(yup.string().required().default(''))
      .ensure()
      .default([]),
  })
  .required();

const CreatePost: SharePostScreen = ({ navigation, route }) => {
  const { sharePostId } = route.params;

  const { data: { account } = {} } = useAccount({ fetchPolicy: 'cache-only' });
  const { data: postData } = usePost(sharePostId);
  const [sharePost] = useSharePost();
  const [postAsModalVisible, setPostAsModalVisible] = useState(false);
  const [mentionUsers, setMentionUsers] = useState<User[]>([]);
  const onMentionSelected = useRef<OnSelectUser>();

  const companies = account?.companies ?? [];

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: schema.cast(
      {},
      { assert: false, stripUnknown: true },
    ) as DefaultValues<FormValues>,
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      userId: account?._id,
      body: '',
      mentionIds: [],
    });
  }, [account?._id, reset]);

  const { field: mentionsField } = useController({
    name: 'mentionIds',
    control,
  });
  //const watchBody = watch('body', '');

  const onSubmit = async (values: FormValues): Promise<void> => {
    const { userId, ...postValues } = values;
    try {
      const { data } = await sharePost({
        variables: {
          postId: sharePostId,
          post: {
            ...postValues,
            ...(userId === account?._id ? {} : { companyId: userId }),
          },
        },
      });

      if (data?.sharePost) {
        showMessage('success', 'Successfully shared!');
        navigation.goBack();
      } else {
        showMessage('error', 'Uh oh! We encountered a problem.');
      }
    } catch (err) {
      console.log('error', err);
      showMessage('error', 'Uh oh! We encountered a problem.');
    }
  };

  const postAsData: Option[] = [
    {
      id: account?._id ?? '',
      value: `${account?.firstName} ${account?.lastName}`,
      labelView: (
        <RadioBodyView
          icon={<Avatar user={account} size={32} />}
          label={`${account?.firstName} ${account?.lastName}`}
        />
      ),
    },
    ...companies.map((company) => ({
      id: company._id,
      value: company.name,
      labelView: (
        <RadioBodyView
          icon={
            <Avatar
              user={{
                avatar: company.avatar,
                firstName: company.name,
                lastName: '',
              }}
              size={32}
            />
          }
          label={company.name}
        />
      ),
    })),
  ];

  const onPress = (user: User): void => {
    onMentionSelected.current?.(user);
    mentionsField.onChange(
      Array.from(new Set([...mentionsField.value, user._id])),
    );
  };

  return (
    <SafeAreaView
      style={[pStyles.globalContainer, pStyles.modal]}
      edges={['bottom']}>
      <PostHeader
        leftIcon={
          <RoundIcon
            icon={<X size={20} color={WHITE} />}
            onPress={() => navigation.goBack()}
          />
        }
        centerLabel={postData?.post ? 'Share Post' : 'Create Post'}
        rightLabel={postData?.post ? 'SHARE' : 'NEXT'}
        rightValidation={isValid}
        handleNext={handleSubmit(onSubmit)}
      />
      <View style={styles.usersPart}>
        <Avatar user={account} size={32} />
        <Controller
          control={control}
          name="userId"
          render={({ field }) => (
            <>
              <PostSelection
                icon={<UserSvg />}
                label={
                  postAsData.find((option) => option.id === field.value)
                    ?.value ?? ''
                }
                onPress={
                  postAsData.length > 1
                    ? () => setPostAsModalVisible(true)
                    : undefined
                }
              />
              <PModal
                isVisible={postAsModalVisible}
                title="Post As"
                subTitle="You can post as yourself or a company you manage.">
                <View style={styles.radioGroupStyle}>
                  <RadioGroup
                    options={postAsData}
                    activeButtonId={field.value}
                    circleStyle={styles.radioCircle}
                    onChange={(option) => field.onChange(option.id)}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setPostAsModalVisible(false)}
                  style={styles.doneBtn}>
                  <PLabel label="DONE" />
                </TouchableOpacity>
              </PModal>
            </>
          )}
        />
        <PostSelection
          icon={<GlobalSvg />}
          label={
            AUDIENCE_OPTIONS.find(
              (option) => option.id === postData?.post?.audience,
            )?.value ?? ''
          }
        />
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.contentContainer}>
          <ScrollView
            keyboardDismissMode="interactive"
            style={styles.contentContainer}
            contentContainerStyle={styles.grow}>
            <ExpandingInput
              control={control}
              name="body"
              placeholder="Create a post"
              containerStyle={styles.inputContainer}
              placeholderTextColor={WHITE60}
              renderUsers={(users, onSelected) => {
                setMentionUsers(users);
                onMentionSelected.current = onSelected;
              }}
              viewBelow={
                postData?.post ? (
                  <View style={styles.sharePostContainer}>
                    <SharePostItem
                      post={postData.post}
                      sharedBy={'share-new-post'}
                    />
                  </View>
                ) : null
              }
            />
          </ScrollView>
          <MentionsList users={mentionUsers} onPress={onPress} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  grow: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 4,
  },
  usersPart: {
    marginLeft: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  sharePostContainer: {
    flex: 1,
    marginVertical: 16,
  },
  radioGroupStyle: {
    marginVertical: 30,
  },
  radioCircle: {
    width: 24,
    height: 24,
    fillColor: PRIMARY,
    borderColor: PRIMARY,
    borderWidth: 2,
  },
  radioBodyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioBodyTextStyle: {
    marginLeft: 10,
  },
  doneBtn: {
    width: '100%',
    height: 45,
    borderRadius: 22,
    borderColor: PRIMARYSOLID,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
