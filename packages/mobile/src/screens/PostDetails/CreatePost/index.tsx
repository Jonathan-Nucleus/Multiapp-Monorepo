import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
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
import { PostAttachment } from 'mobile/src/components/common/Attachment';
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
  BGDARK100,
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
import { Attachment } from 'shared/graphql/fragments/post';

const DEVICE_WIDTH = Dimensions.get('window').width;

import DocumentPicker, { types } from 'react-native-document-picker';
import PdfThumbnail from 'react-native-pdf-thumbnail';
import { stat, moveFile } from 'react-native-fs';

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
  attachments?:
    | {
        url: string;
        aspectRatio: number;
        documentLink?: string;
        path?: string;
      }[];
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
    attachments: yup
      .array()
      .of(
        yup.object({
          url: yup.string().required().default(''),
          aspectRatio: yup.number().required().default(1.58),
          documentLink: yup.string().default(''),
          path: yup.string(),
        }),
      )
      .ensure()
      .default([])
      .notRequired(),
    body: yup
      .string()
      .notRequired()
      .when('attachments', {
        is: (attachments: FormValues['attachments']) =>
          !attachments || attachments.length === 0,
        then: yup.string().required('Required'),
      }),
    mentionIds: yup
      .array()
      .of(yup.string().required().default(''))
      .ensure()
      .default([]),
  })
  .required();

export type LocalMedia = Attachment & {
  path?: string;
};

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

  const [mentionUsers, setMentionUsers] = useState<User[]>([]);
  const onMentionSelected = useRef<OnSelectUser>();
  const companies = account?.companies ?? [];
  const [attachment, setAttachment] = useState<string>('');

  const {
    handleSubmit,
    setValue,
    getValues,
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
  const { field: mediaField } = useController({ name: 'attachments', control });
  const { field: mentionsField } = useController({
    name: 'mentionIds',
    control,
  });
  const watchBody = watch('body', '');
  const previewExists = !!previewData;

  useEffect(() => {
    reset(
      post
        ? {
            userId: post.userId,
            body: post.body ?? '',
            audience: post.audience,
            attachments: post.attachments
              ? (post.attachments as LocalMedia[])
              : [],
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

  const onSubmit = useCallback(
    (values: FormValues): void => {
      if (!account) {
        return;
      }

      const { userId, audience, body, mentionIds } = values;
      let { attachments } = values;
      if (attachment && attachments) {
        attachments = [{ ...attachments[0], documentLink: attachment }];
      }

      navigation.navigate('ChooseCategory', {
        ...(post ?? {}),
        userId,
        audience,
        body,
        attachments: attachments?.map(
          ({ url, aspectRatio, path, documentLink }) => ({
            url,
            aspectRatio,
            path,
            documentLink,
          }),
        ),
        mentionIds, // TODO: Parse from body and add here
      });
    },
    [account, navigation, post, attachment],
  );

  const uploadMedia = useCallback(
    async (attachments: ImageOrVideo): Promise<void> => {
      setUploading(true);

      const fileUri = attachments.path;

      const filename = fileUri.substring(fileUri.lastIndexOf('/') + 1);
      const { data } = await fetchUploadLink({
        variables: {
          localFilename: filename.toLowerCase(),
          type: 'POST',
          id: account._id,
        },
      });

      if (!data || !data.uploadLink) {
        showMessage('error', 'Media upload failed');
        return;
      }

      const { remoteName, uploadUrl } = data.uploadLink;
      await upload(uploadUrl, fileUri);

      const mediaValue = getValues('attachments') ?? [];
      mediaField.onChange(
        Array.from(
          new Set([
            ...mediaValue,
            {
              url: remoteName,
              aspectRatio: attachments.width / attachments.height,
              documentLink: attachment,
              path: attachments.path,
              width: attachments.width,
              height: attachments.height,
            },
          ]),
        ),
      );

      setUploadProgress(0);
      setUploading(false);
    },
    [account._id, attachment, fetchUploadLink, getValues, mediaField],
  );

  const uploadFile = async (filePath: string): Promise<void> => {
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

  const openPicker = useCallback(async (): Promise<void> => {
    if (mediaField.value && mediaField.value.length === 5) {
      showMessage('error', 'You can upload only upload up to 5 photos');
      return;
    }

    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
      compressImageQuality: 0.8,
      compressVideoPreset: 'Passthrough',
      forceJpg: true,
      multiple: false,
      mediaType: mediaField.value.length >= 1 ? 'photo' : 'any',
    });

    await uploadMedia(image);
  }, [mediaField.value, uploadMedia]);

  const takePhoto = async (): Promise<void> => {
    const image = await ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: false, // cropping caused error
      includeBase64: true,
      compressImageQuality: 0.8,
      includeExif: true,
    });

    await uploadMedia(image);
  };

  const takeVideo = async (): Promise<void> => {
    const videoData = await ImagePicker.openCamera({
      mediaType: 'video',
      compressVideoPreset: 'Passthrough',
    });

    await uploadMedia(videoData);
  };

  const openDocumentPicker = async (): Promise<void> => {
    const document = await DocumentPicker.pickSingle({
      type: types.pdf,
      copyTo: 'cachesDirectory',
    });

    if (document?.fileCopyUri) {
      try {
        // Rename file to avoid trouble with spaces
        const originalPath = document.fileCopyUri.replace(/%20/g, ' ');
        const fileDirectory = originalPath.substring(
          0,
          originalPath.lastIndexOf('/'),
        );
        const filePath = `${fileDirectory}/${new Date()
          .getTime()
          .toString()}.pdf`;
        await moveFile(originalPath, filePath);

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

        await uploadFile(filePath);
        await uploadMedia(pdfImageData);
      } catch (e) {
        console.log('exception...', e);
      }
    }
  };

  const clearImage = useCallback(
    (index: number): void => {
      if (mediaField.value && mediaField.value.length > index) {
        mediaField.value.splice(index, 1);
        mediaField.onChange(mediaField.value);
      }
    },
    [mediaField],
  );

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
                  {watchBody &&
                  !uploading &&
                  !post?.attachments?.[0] &&
                  previewData ? (
                    <PreviewLink
                      previewData={previewData}
                      containerStyle={styles.attachment}
                    />
                  ) : null}
                </>
              }
            />
            <View style={styles.flex}>
              {!uploading && mediaField.value && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={mediaField.value.length > 1}>
                  {mediaField.value.map((attachments, index) => {
                    return (
                      <View
                        key={index}
                        style={[
                          styles.attachment,
                          mediaField.value.length > 1
                            ? styles.previewContainer
                            : styles.onPreviewContainer,
                        ]}>
                        <PostAttachment
                          userId={account._id}
                          mediaId={post?._id}
                          attachment={{
                            ...attachments,
                            url: attachments.path ?? attachments.url,
                          }}
                          onLoad={({ naturalSize }) => {
                            if (naturalSize.orientation === 'portrait') {
                              mediaField.onChange({
                                ...mediaField.value[index],
                                aspectRatio:
                                  Math.min(
                                    naturalSize.width,
                                    naturalSize.height,
                                  ) /
                                  Math.max(
                                    naturalSize.width,
                                    naturalSize.height,
                                  ),
                              });
                            }
                          }}
                          style={[
                            styles.preview,
                            mediaField.value.length > 1
                              ? styles.multiPreview
                              : styles.onePreview,
                          ]}
                        />
                        <Pressable
                          onPress={() => clearImage(index)}
                          style={styles.closeButton}>
                          <X color={WHITE} size={24} />
                        </Pressable>
                      </View>
                    );
                  })}
                </ScrollView>
              )}
            </View>
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
              disabled={!!mediaField.value[0]?.documentLink}
            />
            <IconButton
              icon={<VideoCamera size={32} color={WHITE} />}
              label="Take Video"
              textStyle={styles.iconText}
              viewStyle={styles.iconButton}
              onPress={takeVideo}
              disabled={mediaField.value.length >= 1}
            />
            <IconButton
              icon={<GalleryImage size={32} color={WHITE} />}
              label="Gallery"
              textStyle={styles.iconText}
              viewStyle={styles.iconButton}
              onPress={openPicker}
              disabled={!!mediaField.value[0]?.documentLink}
            />
            <IconButton
              icon={<FilePdf size={32} color={WHITE} />}
              label="Attach PDF"
              textStyle={styles.iconText}
              viewStyle={styles.iconButton}
              onPress={openDocumentPicker}
              disabled={mediaField.value.length >= 1}
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
    backgroundColor: BLACK,
    borderRadius: 0,
  },
  onePreview: {
    width: DEVICE_WIDTH - 32,
  },
  multiPreview: {
    width: (276 * DEVICE_WIDTH) / 390,
  },
  previewContainer: {
    marginRight: 20,
    backgroundColor: BGDARK100,
  },
  onPreviewContainer: {
    backgroundColor: BGDARK100,
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
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 8,
    height: 96,
    zIndex: 2,
  },
  clearMargin: {
    marginTop: 0,
  },
  iconButton: {
    flexDirection: 'column',
    flex: 1,
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
