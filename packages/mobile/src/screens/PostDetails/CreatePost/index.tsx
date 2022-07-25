import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { CircleSnail, Pie } from 'react-native-progress';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { X } from 'phosphor-react-native';
import {
  Camera,
  FilePdf,
  VideoCamera,
  Image as GalleryImage,
} from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import RadioGroup, { Option } from 'react-native-radio-button-group';

import UserSvg from 'shared/assets/images/user.svg';
import GlobalSvg from 'shared/assets/images/global.svg';
import AISvg from 'shared/assets/images/AI.svg';
import QPSvg from 'shared/assets/images/QP.svg';
import QCSvg from 'shared/assets/images/QC.svg';

import Avatar from 'mobile/src/components/common/Avatar';
import PLabel from 'mobile/src/components/common/PLabel';
import IconButton from 'mobile/src/components/common/IconButton';
import PModal from 'mobile/src/components/common/PModal';
import RoundIcon from 'mobile/src/components/common/RoundIcon';
import PreviewLink from 'mobile/src/components/common/PreviewLink';
import { PostMedia } from 'mobile/src/components/common/Media';
import { showMessage } from 'mobile/src/services/ToastService';
import pStyles from 'mobile/src/theme/pStyles';
import {
  BGDARK,
  BLACK,
  PRIMARY,
  PRIMARYSOLID,
  WHITE,
  WHITE12,
  WHITE60,
} from 'shared/src/colors';

import {
  Controller,
  DefaultValues,
  useController,
  useForm,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  LinkPreview,
  useLinkPreview,
} from 'shared/graphql/query/post/useLinkPreview';
import { useFetchUploadLink } from 'shared/graphql/mutation/posts';
import { useAccountContext } from 'shared/context/Account';
import { LINK_PATTERN } from 'shared/src/patterns';

import type { Audience } from 'shared/graphql/query/post/usePosts';
import { Audiences } from 'backend/graphql/enumerations.graphql';

import PostHeader from './PostHeader';
import PostSelection from './PostSelection';
import ExpandingInput, {
  OnSelectUser,
  User,
} from 'mobile/src/components/common/ExpandingInput';
import MentionsList from 'mobile/src/components/main/MentionsList';

import { CreatePostScreen } from 'mobile/src/navigations/PostDetailsStack';

import DocumentPicker, { types } from 'react-native-document-picker';
import PdfThumbnail from 'react-native-pdf-thumbnail';
import { stat } from 'react-native-fs';

const RadioBodyView = (props: any): React.ReactElement => {
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
    id: 'QUALIFIED_CLIENT',
    value: 'Qualified Clients',
    labelView: (
      <RadioBodyView
        icon={<QCSvg width={24} height={24} />}
        label="Qualified Clients"
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
];

type FormValues = {
  userId: string;
  audience: Audience;
  media?: {
    url: string;
    aspectRatio: number;
    documentLink?: string;
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
        documentLink: yup.string().default(''),
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

  const account = useAccountContext();
  const [fetchUploadLink] = useFetchUploadLink();
  const [fetchPreviewData] = useLinkPreview();

  const [previewData, setPreviewData] = useState<LinkPreview>();
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [postAsModalVisible, setPostAsModalVisible] = useState(false);
  const [audienceModalVisible, setAudienceModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageData, setImageData] = useState<ImageOrVideo | undefined>(
    undefined,
  );

  const [mentionUsers, setMentionUsers] = useState<User[]>([]);
  const onMentionSelected = useRef<OnSelectUser>();
  const companies = account?.companies ?? [];
  const [attachment, setAttachment] = useState<string>('');

  const {
    handleSubmit,
    setValue,
    watch,
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
  const postUserId = watch('userId');

  useEffect(() => {
    reset(
      post
        ? {
            userId: post.userId,
            body: post.body ?? '',
            audience: post.audience,
            media: post.media ?? undefined,
            mentionIds: post.mentionIds ?? [],
          }
        : { userId: account?._id },
    );
  }, [post, account?._id, reset]);

  useEffect(() => {
    const willShowSubscription = Keyboard.addListener('keyboardWillShow', () =>
      setKeyboardShowing(true),
    );
    const willHideSubscription = Keyboard.addListener('keyboardWillHide', () =>
      setKeyboardShowing(false),
    );

    return () => {
      willShowSubscription.remove();
      willHideSubscription.remove();
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
  const previewExists = !!previewData;
  useEffect(() => {
    const getData = async (): Promise<void> => {
      if (!watchBody) {
        return;
      }

      const { data } = await fetchPreviewData({
        variables: {
          body: watchBody,
        },
      });

      setPreviewData(data?.linkPreview ?? undefined);
    };
    if (watchBody?.match(LINK_PATTERN)) {
      getData();
    } else if (previewExists) {
      setPreviewData(undefined);
    }
  }, [watchBody, fetchPreviewData, previewExists]);

  const onSubmit = (values: FormValues): void => {
    if (!account) {
      return;
    }

    // eslint-disable-next-line prefer-const
    let { userId, audience, body, media, mentionIds } = values;

    if (attachment && media) {
      media = { ...media, documentLink: attachment };
    }

    navigation.navigate('ChooseCategory', {
      ...(post ?? {}),
      userId,
      audience,
      body,
      media: media ?? undefined,
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
      compressVideoPreset: 'Passthrough',
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
      includeExif: true,
    });

    await uploadImage(image);
  };

  const takeVideo = async (): Promise<void> => {
    const videoData = await ImagePicker.openCamera({
      mediaType: 'video',
      compressVideoPreset: 'Passthrough',
    });

    await uploadImage(videoData);
  };

  const openDocumentPicker = async (): Promise<void> => {
    const document = await DocumentPicker.pickSingle({
      type: types.pdf,
    });

    if (document?.uri) {
      try {
        const filePath = document.uri;
        const image = await PdfThumbnail.generate(filePath, 0);
        const statResult = await stat(image.uri);
        const pdfImageData = {
          size: statResult.size,
          duration: null,
          mime: 'image/jpeg',
          path: image.uri,
          width: image.width,
          height: image.height,
        };

        await uploadFile(document.uri);
        await uploadImage(pdfImageData);
      } catch (e) {
        console.log('exception...', e);
      }
    }
  };

  const uploadImage = async (image: ImageOrVideo): Promise<void> => {
    setUploading(true);

    const fileUri = image.path;

    const filename = fileUri.substring(fileUri.lastIndexOf('/') + 1);
    const { data } = await fetchUploadLink({
      variables: {
        localFilename: filename.toLowerCase(),
        type: 'POST',
        id: account._id,
      },
    });

    if (!data || !data.uploadLink) {
      showMessage('error', 'Image upload failed');
      return;
    }

    const { remoteName, uploadUrl } = data.uploadLink;

    await upload(uploadUrl, fileUri);

    mediaField.onChange({
      url: remoteName,
      documentLink: attachment,
      aspectRatio: image.width / image.height,
    });

    setImageData(image);
    setUploadProgress(0);
    setUploading(false);
  };

  const upload = async (uploadUrl: string, fileUri: string): Promise<void> => {
    try {
      await new Promise((resolver, rejecter) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolver(true);
          } else {
            const error = new Error(xhr.response);
            rejecter(error);
          }
        };
        xhr.onerror = (error) => {
          rejecter(error);
        };
        xhr.upload.onprogress = (evt) => {
          setUploadProgress(evt.loaded / evt.total);
        };
        xhr.open('PUT', uploadUrl);
        xhr.send({ uri: fileUri });
      });
    } catch (err) {
      console.log('Error uploading file', err);
    }
  };

  const uploadFile = async (filePath: string) => {
    setUploading(true);
    const filename = filePath.substring(filePath.lastIndexOf('/') + 1);
    const { data } = await fetchUploadLink({
      variables: {
        localFilename: filename.toLowerCase(),
        type: 'POST',
        id: account._id,
      },
    });

    if (!data || !data.uploadLink) {
      showMessage('error', 'Attachment upload failed');
      return;
    }

    const { remoteName, uploadUrl } = data.uploadLink;

    await upload(uploadUrl, filePath);

    setAttachment(remoteName);
  };

  const clearImage = (): void => {
    mediaField.onChange(undefined);
    setImageData(undefined);
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
          icon={<Avatar user={company} size={32} />}
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
        centerLabel={'Create a Post'}
        rightLabel={'NEXT'}
        rightValidation={isValid && !uploading}
        handleNext={handleSubmit(onSubmit)}
      />
      <View style={[styles.usersPart, styles.container]}>
        <Avatar
          user={
            postUserId === account._id
              ? account
              : account.companies.find((company) => company._id === postUserId)
          }
          size={32}
        />
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
                  AUDIENCE_OPTIONS.find((option) => option.id === field.value)
                    ?.value ?? ''
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
      <KeyboardAvoidingView
        style={[styles.flex]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.contentContainer, styles.container]}>
          <ScrollView
            keyboardDismissMode="interactive"
            style={styles.contentContainer}
            contentContainerStyle={styles.grow}>
            <ExpandingInput
              control={control}
              name="body"
              placeholder="Create a post"
              containerStyle={styles.bodyInput}
              placeholderTextColor={WHITE60}
              renderUsers={(users, onSelected) => {
                setMentionUsers(users);
                onMentionSelected.current = onSelected;
              }}
              viewBelow={
                <>
                  {uploading ? (
                    <View style={[styles.attachment, styles.uploadIndicator]}>
                      {uploadProgress === 0 ? (
                        <CircleSnail color={PRIMARYSOLID} size={40} />
                      ) : (
                        <Pie
                          color={PRIMARYSOLID}
                          size={40}
                          progress={uploadProgress}
                        />
                      )}
                    </View>
                  ) : null}
                  {imageData || mediaField.value ? (
                    <View style={styles.attachment}>
                      <PostMedia
                        userId={account._id}
                        media={
                          imageData
                            ? {
                                url: imageData.path,
                                aspectRatio: imageData.width / imageData.height,
                              }
                            : mediaField.value!
                        }
                        onLoad={({ naturalSize }) => {
                          if (naturalSize.orientation === 'portrait') {
                            mediaField.onChange({
                              ...mediaField.value,
                              aspectRatio:
                                Math.min(
                                  naturalSize.width,
                                  naturalSize.height,
                                ) /
                                Math.max(naturalSize.width, naturalSize.height),
                            });
                          }
                        }}
                        style={styles.preview}
                      />
                      <Pressable
                        onPress={clearImage}
                        style={styles.closeButton}>
                        <X color={WHITE} size={24} />
                      </Pressable>
                    </View>
                  ) : null}
                  {watchBody &&
                  !uploading &&
                  !imageData &&
                  !post?.media?.url &&
                  previewData ? (
                    <PreviewLink
                      previewData={previewData}
                      containerStyle={styles.attachment}
                    />
                  ) : null}
                </>
              }
            />
          </ScrollView>
          <MentionsList users={mentionUsers} onPress={onPress} />
        </View>
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
            <IconButton
              icon={<FilePdf size={32} color={WHITE} />}
              label="PDF"
              textStyle={styles.iconText}
              viewStyle={styles.iconButton}
              onPress={openDocumentPicker}
            />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  flex: {
    flex: 1,
  },
  grow: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  usersPart: {
    marginTop: 16,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bodyInput: {
    marginTop: 8,
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  uploadIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    aspectRatio: 1.6,
  },
  attachment: {
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  preview: {
    marginVertical: 0,
    marginTop: 0,
    width: '100%',
    backgroundColor: BLACK,
  },
  closeButton: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  actionWrapper: {
    backgroundColor: BGDARK,
    borderTopColor: WHITE12,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 25,
    height: 96,
    zIndex: 2,
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
