import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  View,
} from 'react-native';
import ImagePicker, {
  ImageOrVideo,
  Image as UploadImage,
} from 'react-native-image-crop-picker';
import { X } from 'phosphor-react-native';
import HeicConverter from 'react-native-heic-converter';
import RNFS from 'react-native-fs';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import RadioGroup, { Option } from 'react-native-radio-button-group';
import {
  MentionInput,
  MentionSuggestionsProps,
} from 'react-native-controlled-mentions';
import _isEqual from 'lodash/isEqual';
import {
  Camera,
  VideoCamera,
  Image as GalleryImage,
} from 'phosphor-react-native';
const Buffer = global.Buffer || require('buffer').Buffer;

import { POST_URL } from 'react-native-dotenv';

import UserSvg from 'shared/assets/images/user.svg';
import GlobalSvg from 'shared/assets/images/global.svg';
import AISvg from 'shared/assets/images/AI.svg';
import QPSvg from 'shared/assets/images/QP.svg';
import QCSvg from 'shared/assets/images/QC.svg';

import Avatar from 'mobile/src/components/common/Avatar';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PLabel from 'mobile/src/components/common/PLabel';
import IconButton from 'mobile/src/components/common/IconButton';
import UserInfo from 'mobile/src/components/common/UserInfo';
import PModal from 'mobile/src/components/common/PModal';
import RoundIcon from 'mobile/src/components/common/RoundIcon';
import { showMessage } from 'mobile/src/services/utils';
import pStyles from 'mobile/src/theme/pStyles';
import {
  SECONDARY,
  WHITE60,
  PRIMARY,
  PRIMARYSOLID,
  WHITE,
  WHITE12,
  BGDARK,
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
import {
  useMentionUsers,
  User,
} from 'shared/graphql/query/user/useMentionUsers';
import { useFetchUploadLink } from 'shared/graphql/mutation/posts';

import type { Audience } from 'shared/graphql/query/post/usePosts';
import { Audiences } from 'backend/graphql/enumerations.graphql';

import PostHeader from './PostHeader';
import PostSelection from './PostSelection';
import PreviewLink from './PreviewLink';

import { CreatePostScreen } from 'mobile/src/navigations/PostDetailsStack';

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
  audience: Audience;
  media?: {
    url: string;
    aspectRatio: number;
  };
  body?: string;
  mentionIds: string[];
};

const schema = yup
  .object({
    userId: yup.string().required('Required'),
    audience: yup
      .mixed()
      .oneOf<Audience>(Audiences)
      .default('EVERYONE')
      .required(),
    media: yup
      .object({
        url: yup.string().required().default(''),
        aspectRatio: yup.number().required().default(1.58),
      })
      .default(undefined),
    body: yup
      .string()
      .notRequired()
      .when('media', {
        is: (media: FormValues['media']) => !media,
        then: yup.string().required('Required'),
      }),
    mentionIds: yup
      .array()
      .of(yup.string().required().default(''))
      .ensure()
      .default([]),
  })
  .required();

const CreatePost: CreatePostScreen = ({ navigation, route }) => {
  const { post } = route.params;

  const { data: { account } = {} } = useAccount({ fetchPolicy: 'cache-only' });
  const { data: usersData, refetch } = useMentionUsers();
  const [fetchUploadLink] = useFetchUploadLink();

  const mentionUndefinedCount = useRef(0);
  const currentSearch = useRef<string | undefined>(undefined);
  const lastSearch = useRef<string | undefined>(undefined);
  const nextSearch = useRef<string | undefined>(undefined);

  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [postAsModalVisible, setPostAsModalVisible] = useState(false);
  const [audienceModalVisible, setAudienceModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageData, setImageData] = useState<ImageOrVideo | undefined>(
    undefined,
  );

  const [mentionUsers, setMentionUsers] = useState(
    usersData?.mentionUsers ?? [],
  );
  const companies = account?.companies ?? [];

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: schema.cast(
      post
        ? {
            userId: post.userId,
            body: post.body ?? '',
            audience: post.audience,
            media: post.media ?? undefined,
            mentionIds: post.mentionIds ?? [],
          }
        : { user: account?._id },
      { assert: false, stripUnknown: true },
    ) as DefaultValues<FormValues>,
    mode: 'onChange',
  });

  useEffect(() => {
    const onShow = () => setKeyboardShowing(true);
    const onHide = () => setKeyboardShowing(false);

    Keyboard.addListener('keyboardWillShow', onShow);
    Keyboard.addListener('keyboardWillHide', onHide);

    return () => {
      Keyboard.removeListener('keyboardWillShow', onShow);
      Keyboard.removeListener('keyboardWillHide', onHide);
    };
  }, []);

  useEffect(() => {
    if (account && !post?._id) {
      setValue('userId', account._id);
    }
  }, [account, setValue, post]);

  const { field: mediaField } = useController({ name: 'media', control });
  const { field: mentionsField } = useController({
    name: 'mentionIds',
    control,
  });
  const watchBody = watch('body', '');

  const onSubmit = (values: FormValues): void => {
    if (!account) {
      return;
    }

    const { userId, audience, body, media, mentionIds } = values;
    navigation.navigate('ChooseCategory', {
      ...(post ?? {}),
      userId,
      audience,
      body,
      media,
      localMediaPath: imageData?.path,
      mentionIds, // TODO: Parse from body and add here
    });
  };

  const openPicker = async (): Promise<void> => {
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
      compressImageQuality: 0.8,
    });

    await uploadImage(image);
  };

  const takePhoto = async (): Promise<void> => {
    const image = await ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: false, // cropping caused error
      includeBase64: true,
      compressImageQuality: 0.8,
    });

    await uploadImage(image);
  };

  const takeVideo = async (): Promise<void> => {
    const videoData = await ImagePicker.openCamera({
      mediaType: 'video',
    });

    await uploadImage(videoData);
  };

  const uploadImage = async (image: ImageOrVideo): Promise<void> => {
    setUploading(true);
    let fileUri = image.path;

    const filename = fileUri.substring(fileUri.lastIndexOf('/') + 1);
    const { data } = await fetchUploadLink({
      variables: {
        localFilename: filename,
        type: 'POST',
      },
    });

    if (!data || !data.uploadLink) {
      showMessage('error', 'Image upload failed');
      return;
    }

    const { remoteName, uploadUrl } = data.uploadLink;
    const rawData = await RNFS.readFile(fileUri, 'base64');
    const buffer = new Buffer(
      rawData.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );

    console.log('uploadUrl', uploadUrl);
    const result = await fetch(uploadUrl, {
      method: 'PUT',
      body: buffer,
    });

    if (!result.ok) {
      showMessage('error', 'Image upload failed');
      return;
    }

    mediaField.onChange({
      url: remoteName,
      aspectRatio: image.width / image.height,
    });

    setImageData(image);
    setUploading(false);
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

  const fetchMentionUsers = useCallback(
    async (search: string) => {
      if (search === lastSearch.current) {
        return;
      }

      if (currentSearch.current !== undefined) {
        nextSearch.current = search;
        return;
      }

      currentSearch.current = search;
      const { data } = await refetch({ search });

      if (data.mentionUsers && !_isEqual(mentionUsers, data.mentionUsers)) {
        setMentionUsers(data.mentionUsers);
      }

      lastSearch.current = currentSearch.current;
      currentSearch.current = undefined;
      if (nextSearch.current) {
        fetchMentionUsers(nextSearch.current);
        nextSearch.current = undefined;
      }
    },
    [mentionUsers, refetch],
  );

  const clearMentions = () => {
    // Avoid issue with setting state from inside renderSuggestion render
    // cycle
    setTimeout(() => {
      setMentionUsers([]);
      lastSearch.current = undefined;
      currentSearch.current = undefined;
      nextSearch.current = undefined;
    }, 10);
  };

  const renderSuggestions = useCallback(
    ({
      keyword,
      onSuggestionPress,
    }: MentionSuggestionsProps): React.ReactNode => {
      if (keyword === undefined) {
        mentionUndefinedCount.current++;
        if (mentionUndefinedCount.current > 1) {
          mentionUndefinedCount.current = 0;
          clearMentions();
          return null;
        }
      } else {
        mentionUndefinedCount.current = 0;
      }

      if (keyword !== undefined) {
        fetchMentionUsers(keyword);
      }

      if (mentionUsers.length === 0) {
        return null;
      }

      const onPress = (user: User) => {
        onSuggestionPress({
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
        });
        mentionsField.onChange(
          Array.from(new Set([...mentionsField.value, user._id])),
        );
        clearMentions();
      };

      return (
        <ScrollView
          style={styles.mentionList}
          contentContainerStyle={styles.mentionContentContainer}>
          <View style={styles.flex}>
            {mentionUsers.map((user) => (
              <Pressable
                key={user._id}
                onPress={() => onPress(user)}
                style={styles.mentionItem}>
                <UserInfo user={user} avatarSize={32} showFollow={false} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      );
    },
    [mentionUsers, fetchMentionUsers, mentionsField],
  );

  const dragGesture = Gesture.Pan().onStart(() => Keyboard.dismiss());

  return (
    <View style={[pStyles.globalContainer, pStyles.modal]}>
      <PostHeader
        leftIcon={
          <RoundIcon
            icon={<X size={20} color={WHITE} />}
            onPress={() => navigation.goBack()}
          />
        }
        centerLabel="Create Post"
        rightLabel="NEXT"
        rightValidation={isValid}
        handleNext={handleSubmit(onSubmit)}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.contentContainer}>
          <PAppContainer
            noScroll
            disableKeyboardScroll
            modal
            contentContainerStyle={styles.flex}>
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
              <Controller
                control={control}
                name="audience"
                render={({ field }) => (
                  <>
                    <PostSelection
                      icon={<GlobalSvg />}
                      label={
                        AUDIENCE_OPTIONS.find(
                          (option) => option.id === field.value,
                        )?.value ?? ''
                      }
                      onPress={() => setAudienceModalVisible(true)}
                    />
                    <PModal
                      isVisible={audienceModalVisible}
                      title="Audience"
                      subTitle="Who can see your post?">
                      <View style={styles.radioGroupStyle}>
                        <RadioGroup
                          options={AUDIENCE_OPTIONS}
                          activeButtonId={field.value}
                          circleStyle={styles.radioCircle}
                          onChange={(option) => field.onChange(option.id)}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => setAudienceModalVisible(false)}
                        style={styles.doneBtn}>
                        <PLabel label="DONE" />
                      </TouchableOpacity>
                    </PModal>
                  </>
                )}
              />
            </View>
            <GestureDetector gesture={dragGesture}>
              <Controller
                control={control}
                name="body"
                render={({ field }) => (
                  <MentionInput
                    keyboardAppearance="dark"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    placeholder="Create a post"
                    placeholderTextColor={WHITE60}
                    style={styles.mentionInput}
                    containerStyle={[styles.mentionContainer]}
                    partTypes={[
                      {
                        isBottomMentionSuggestionsRender: true,
                        isInsertSpaceAfterMention: true,
                        trigger: '@',
                        renderSuggestions,
                        textStyle: {
                          color: SECONDARY,
                        },
                      },
                    ]}
                  />
                )}
              />
            </GestureDetector>
          </PAppContainer>
          {mentionUsers.length === 0 ? (
            <View
              style={[
                styles.actionWrapper,
                keyboardShowing ? styles.clearMargin : null,
              ]}>
              <IconButton
                icon={<Camera size={32} color={WHITE} />}
                label="Take Photo"
                textStyle={styles.iconText}
                viewStyle={styles.iconButton}
                onPress={takePhoto}
              />
              <IconButton
                icon={<VideoCamera size={32} color={WHITE} />}
                label="Take Video"
                textStyle={styles.iconText}
                viewStyle={styles.iconButton}
                onPress={takeVideo}
              />
              <IconButton
                icon={<GalleryImage size={32} color={WHITE} />}
                label="Gallery"
                textStyle={styles.iconText}
                viewStyle={styles.iconButton}
                onPress={openPicker}
              />
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
      {uploading ? (
        <View style={[styles.postImage, styles.uploadIndicator]}>
          <ActivityIndicator size="large" />
        </View>
      ) : null}
      {imageData ? (
        <Image
          source={{ uri: imageData.path }}
          style={styles.postImage}
          resizeMode="cover"
        />
      ) : post?.media ? (
        <Image
          source={{ uri: `${POST_URL}/${post.media.url}` }}
          style={styles.postImage}
        />
      ) : null}
      {watchBody && !uploading && !imageData && !post?.media?.url ? (
        <View style={styles.postImage}>
          <PreviewLink body={watchBody} />
        </View>
      ) : null}
    </View>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  usersPart: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mentionInput: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    lineHeight: 20,
    color: 'white',
    marginTop: 16,
    fontSize: 16,
    flex: 1,
  },
  mentionContainer: {
    flex: 1,
    flexGrow: 1,
  },
  mentionList: {
    backgroundColor: BLACK,
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
    maxHeight: 270,
    flexGrow: 0,
    width: '100%',
    bottom: 0,
  },
  mentionContentContainer: {},
  mentionItem: {
    borderBottomWidth: 1,
    borderBottomColor: WHITE12,
  },
  uploadIndicator: {
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postImage: {
    position: 'absolute',
    bottom: 96,
    left: 16,
    right: 16,
    height: 224,
    marginVertical: 16,
    borderRadius: 16,
    zIndex: -1,
  },
  actionWrapper: {
    marginTop: 240,
    backgroundColor: BGDARK,
    borderTopColor: WHITE12,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 25,
    height: 96,
  },
  clearMargin: {
    marginTop: 0,
  },
  iconButton: {
    flexDirection: 'column',
  },
  iconText: {
    marginTop: 5,
    marginLeft: 0,
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
