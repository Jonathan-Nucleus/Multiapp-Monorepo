import { FC, useState, useEffect, useRef, useCallback } from "react";
import {
  Buildings,
  CaretDown,
  CircleWavy,
  FilePdf,
  GlobeHemisphereEast,
  Image as ImageIcon,
  Smiley,
  User,
  X,
} from "phosphor-react";
import _ from "lodash";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";

import Avatar from "desktop/app/components/common/Avatar";
import Button from "desktop/app/components/common/Button";
import CategorySelector, { categoriesSchema } from "./CategorySelector";
import Dropdown from "../../../common/Dropdown";
import EmojiPicker from "../../../common/EmojiPicker";
import Input from "desktop/app/components/common/Input";
import Label from "desktop/app/components/common/Label";
import LinkPreview from "../LinkPreview";
import AttachmentPreview from "./AttachmentPreview";
import MediaSelector, {
  mediaSchema,
  Media,
} from "./AttachmentPreview/MediaSelector";
import MentionTextarea, { mentionTextSchema } from "../MentionTextarea";
import ModalDialog from "../../../common/ModalDialog";
import Post from "../Post";
import Spinner from "desktop/app/components/common/Spinner";
import { toast } from "../../../common/Toast";

import { getInitials } from "../../../../lib/utilities";
import { generateThumbnail } from "desktop/app/lib/pdf-thumbnail";

import {
  useCreatePost,
  useFetchUploadLink,
} from "shared/graphql/mutation/posts";
import { Audience, PostCategory } from "backend/graphql/posts.graphql";
import { Audiences } from "backend/graphql/enumerations.graphql";
import { PostSummary } from "shared/graphql/fragments/post";
import { useEditPost } from "shared/graphql/mutation/posts/useEditPost";
import { hrefFromLink, isWebLink, LINK_PATTERN } from "shared/src/patterns";
import { useAccountContext } from "shared/context/Account";
import { AudienceOptions } from "backend/schemas/post";
import { AccreditationEnum, AccreditationOptions } from "backend/schemas/user";
import { useSharePost } from "shared/graphql/mutation/posts/useSharePost";

import {
  useLinkPreview,
  LinkPreview as LinkPreviewResponse,
} from "shared/graphql/query/post/useLinkPreview";
import { getMediaTypeFrom } from "shared/src/media";

const audienceOptions = Object.keys(AudienceOptions).map((key) => {
  if (key == "EVERYONE") {
    return {
      icon: (
        <GlobeHemisphereEast color="currentColor" weight="fill" size={24} />
      ),
      title: "Everyone",
      value: "EVERYONE",
    };
  } else {
    const value = AccreditationOptions[key as AccreditationEnum];
    return {
      icon: (
        <div className="text-success relative">
          <CircleWavy color="currentColor" weight="fill" size={24} />
          <div className="absolute inset-0 flex items-center justify-center text-tiny font-bold text-white">
            {getInitials(value.label)}
          </div>
        </div>
      ),
      title: value.label,
      value: key,
    };
  }
});

type FormValues = {
  user: string;
  audience: Audience;
  attachments: Media[];
  categories: PostCategory[];
  mentionInput: {
    body?: string;
    mentions?: {
      id: string;
      name: string;
    }[];
  };
};

const schema = yup
  .object({
    user: yup.string().required("Required"),
    audience: yup
      .mixed()
      .oneOf<Audience>(Audiences)
      .default("EVERYONE")
      .required(),
    attachments: mediaSchema,
    categories: categoriesSchema,
    mentionInput: mentionTextSchema,
  })
  .required();

export type PostActionType =
  | { type: "create"; post?: PostSummary; files?: FileList }
  | { type: "edit"; post: PostSummary; files?: never[] }
  | { type: "share"; post: PostSummary; files?: never[] };

interface EditPostModalProps {
  actionData: PostActionType;
  show: boolean;
  onClose: (videoPostId?: string) => void;
}

const EditPostModal: FC<EditPostModalProps> = ({
  actionData: { type: actionType, post: actionPost },
  show,
  onClose,
}) => {
  const account = useAccountContext();
  const [createPost] = useCreatePost();
  const [editPost] = useEditPost();
  const [sharePost] = useSharePost();
  const [fetchUploadLink] = useFetchUploadLink();
  const [fetchLinkPreview] = useLinkPreview();

  const [showCategories, setShowCategories] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPercent, setUploadingPercent] = useState<number>();
  const [preview, setPreview] = useState<LinkPreviewResponse>();
  const [previewLoading, setPreviewLoading] = useState(false);
  const [visibleEmoji, setVisibleEmoji] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previewLink = useRef<string | undefined>(undefined);
  const suggestionsContainer = useRef<HTMLDivElement>(null);
  const changeCallback = useRef(
    _.debounce(async (linkToFetch: string) => {
      setPreviewLoading(true);
      previewLink.current = linkToFetch;
      const link = hrefFromLink(linkToFetch);
      const { data } = await fetchLinkPreview({
        variables: {
          body: link,
        },
      });
      setPreview(data?.linkPreview);
      setPreviewLoading(false);
    }, 500)
  ).current;

  useEffect(() => {
    // Should focus textarea automatically when component mounted.
    // currently we are using setTimeout since focus() method does not work
    // when click to open from "Edit Post" button menu.
    // #headlessui, #menu, #https://blog.maisie.ink/react-ref-autofocus/
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  const userOptions =
    account.companies.length > 0
      ? [
          {
            icon: <User color="currentColor" weight="fill" size={24} />,
            title: `${account.firstName} ${account.lastName}`,
            value: account._id,
          },
          ...account.companies.map((company) => ({
            icon: <Buildings color="currentColor" weight="fill" size={24} />,
            title: company.name,
            value: company._id,
          })),
        ]
      : [];

  let defaultValues = {};
  if (actionType == "create") {
    defaultValues = {
      user: account._id,
      audience: "EVERYONE",
      categories: [],
      attachments: [],
    };
  } else if (actionType == "edit" && actionPost) {
    defaultValues = {
      user: actionPost.userId,
      audience: actionPost.audience,
      attachments:
        actionPost.attachments?.map((item) => ({
          ...item,
          ...(item.documentLink ? {} : { documentLink: undefined }),
        })) ?? [],
      categories: actionPost.categories,
      mentionInput: { body: actionPost.body ?? "" },
    };
  } else if (actionType == "share" && actionPost) {
    defaultValues = {
      user: account._id,
      mentionInput: { body: "" },
      audience: actionPost.audience,
      categories: actionPost.categories,
    };
  }

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: schema.cast(defaultValues) as DefaultValues<FormValues>,
    mode: "onChange",
  });
  const currentAttachments = watch("attachments") ?? [];

  useEffect(() => {
    const subscription = watch(({ mentionInput, attachments }, { name }) => {
      if (
        name == "mentionInput.body" &&
        (!attachments || attachments.length === 0)
      ) {
        const body = mentionInput?.body;
        if (!body) {
          previewLink.current = undefined;
          setPreview(undefined);
          return;
        }

        const result = body.matchAll(LINK_PATTERN);
        const matches = Array.from(result);
        if (matches.length > 0) {
          const linkToFetch = matches
            .map((match) => match[0])
            .find((link) => isWebLink(link));
          if (linkToFetch && linkToFetch != previewLink.current) {
            changeCallback(linkToFetch);
          }
          return;
        }

        previewLink.current = undefined;
        setPreview(undefined);
      }
    });
    return () => subscription.unsubscribe();
  }, [changeCallback, watch]);

  const onSubmit: SubmitHandler<FormValues> = async ({
    user,
    audience,
    attachments,
    categories,
    mentionInput,
  }) => {
    setLoading(true);
    try {
      const previewData = preview as LinkPreviewResponse & {
        __typename?: string;
      };

      if (previewData) {
        delete previewData.__typename;
      }

      const sendingAttachments = attachments?.map(
        ({ url, aspectRatio, documentLink }) => ({
          url,
          aspectRatio,
          documentLink,
        })
      );
      if (actionType == "create") {
        const { data } = await createPost({
          variables: {
            post: {
              audience,
              categories,
              attachments: sendingAttachments ?? [],
              preview: previewData,
              body: mentionInput.body,
              mentionIds: mentionInput.mentions?.map((mention) => mention.id),
              ...(user != account?._id ? { companyId: user } : {}),
            },
          },
        });
        if (data && data.createPost) {
          // When attachments type is only video, pass postId as param
          const mediaTypes = attachments?.map((attachments) =>
            getMediaTypeFrom(attachments?.url ?? "")
          );
          onClose(
            mediaTypes?.includes("video") ? data.createPost?._id : undefined
          );
          return;
        }
      } else if (actionType == "edit" && actionPost) {
        const { data } = await editPost({
          variables: {
            post: {
              _id: actionPost._id,
              userId: actionPost.userId,
              audience,
              categories,
              attachments: sendingAttachments ? sendingAttachments : [],
              preview: previewData,
              body: mentionInput.body,
              mentionIds: mentionInput.mentions?.map((mention) => mention.id),
            },
          },
        });
        if (data && data.editPost) {
          // When attachments type is only video, pass postId as param
          const mediaTypes = attachments?.map((attachments) =>
            getMediaTypeFrom(attachments?.url ?? "")
          );
          onClose(
            mediaTypes?.includes("video") ? data.editPost?._id : undefined
          );
        }
      } else if (actionType == "share" && actionPost) {
        const { data } = await sharePost({
          variables: {
            postId: actionPost._id,
            post: {
              body: mentionInput.body ?? "",
              mentionIds: mentionInput.mentions?.map((mention) => mention.id),
              ...(user != account?._id ? { companyId: user } : {}),
            },
          },
        });
        if (data && data.sharePost) {
          onClose();
        }
      }
    } catch (err) {}
  };

  const onEmojiClick = (emojiObject: any) => {
    const body = getValues("mentionInput.body");
    setValue("mentionInput.body", body + emojiObject.native);
    setVisibleEmoji(false);
    inputRef?.current?.focus();
  };

  const upload = useCallback(
    async (uploadFile: File, showProgress = true) => {
      const { data } = await fetchUploadLink({
        variables: {
          localFilename: uploadFile.name,
          type: "POST",
          id: account._id,
        },
      });
      if (!data || !data.uploadLink) {
        console.log("Error fetching upload link");
        return undefined;
      }
      const { remoteName, uploadUrl } = data.uploadLink;
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
            showProgress && setUploadingPercent((evt.loaded / evt.total) * 100);
          };
          xhr.open("PUT", uploadUrl);
          xhr.send(uploadFile);
        });
      } catch (err) {
        console.log("Error uploading file", err);
        toast.error("Error uploading file.");
        return;
      }

      return remoteName;
    },
    [account._id, fetchUploadLink]
  );

  const uploadMedia = useCallback(
    async (file: File) => {
      setUploadingPercent(0);
      setLoading(true);

      const url = await upload(file);

      setUploadingPercent(undefined);
      setLoading(false);

      return url;
    },
    [upload]
  );

  const handleChangeMedia = async (files: File[]) => {
    if (files.length > 0) {
      if (currentAttachments.length + files.length > 5) {
        toast.error("You can upload up to 5 files.");
        return;
      }

      const newMedia = await Promise.all(
        files.map(async (file) => ({
          file: file,
          url: (await uploadMedia(file)) ?? "",
          aspectRatio: 1.58,
          documentLink: undefined,
        }))
      );

      setValue("attachments", [
        ...currentAttachments,
        ...newMedia.filter((attachments) => attachments.url !== ""),
      ]);
    }
  };

  const handleRemoveMedia = (idx: number) => {
    const attachments = currentAttachments.filter(
      (attachments, index) => index !== idx
    );
    setValue("attachments", attachments);
  };

  const closeModal = () => {
    onClose();
  };

  return (
    <ModalDialog
      className="w-full md:w-auto max-w-full md:h-[80vh] relative"
      show={show}
      onClose={() => {}}
    >
      <form className="h-full">
        <div className="h-full md:flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/[.12]">
            <div className="text-xl text-white font-medium">
              {actionType == "create" && "Create Post"}
              {actionType == "edit" && "Edit Post"}
              {actionType == "share" && "Share Post"}
            </div>
            <Button variant="text">
              <X
                color="white"
                weight="bold"
                size={24}
                onClick={() => onClose()}
              />
            </Button>
          </div>
          <div className="flex flex-col md:flex-row flex-grow md:min-h-0">
            <div className="flex flex-col md:w-[40rem] relative">
              <div className="flex flex-wrap items-center p-4">
                <Avatar size={56} user={account} />
                {userOptions.length > 0 && (
                  <div className="ml-2">
                    <Dropdown
                      items={userOptions}
                      control={control}
                      name="user"
                    />
                  </div>
                )}
                <div className="ml-2">
                  <Dropdown
                    items={audienceOptions}
                    control={control}
                    name="audience"
                    readonly={actionType == "share"}
                  />
                </div>
              </div>
              <div
                ref={suggestionsContainer}
                className="min-h-0 flex flex-col flex-grow overflow-y-auto mt-2 px-4"
              >
                <div className="text-sm text-white flex-grow">
                  <MentionTextarea
                    type="post"
                    inputRef={inputRef}
                    control={control}
                    name="mentionInput"
                    placeholder={`Create a post${
                      actionType !== "share"
                        ? "\nUse $ before ticker symbols: ex: $TSLA\nUse @ to tag a user, page or fund"
                        : ""
                    }`}
                    suggestionsContainer={
                      suggestionsContainer.current ?? undefined
                    }
                  />
                </div>
                <div className="w-full">
                  {actionType != "share" && (
                    <div className="flex flex-row overflow-x-auto w-full items-center mb-3">
                      {currentAttachments.length === 1 && (
                        <div className="w-full flex-shrink-0 h-full">
                          <AttachmentPreview
                            attachment={currentAttachments[0]}
                            className="my-0"
                            maxHeight={294}
                            removable={true}
                            file={
                              (currentAttachments[0].file as unknown as File) ??
                              undefined
                            }
                            postId={actionPost?._id}
                            userId={actionPost?.userId ?? account._id}
                            percent={uploadingPercent}
                            onLoaded={(aspectRatio) => {
                              const newMedia = [
                                { ...currentAttachments[0], aspectRatio },
                              ];
                              setValue("attachments", newMedia);
                            }}
                            onRemove={() => handleRemoveMedia(0)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {actionType !== "share" &&
                  preview &&
                  currentAttachments.length === 0 && (
                    <div className="my-2 w-100 aspect-video">
                      {previewLoading ? (
                        <Spinner />
                      ) : (
                        <LinkPreview previewData={preview} />
                      )}
                    </div>
                  )}
                {actionType == "share" && actionPost && (
                  <div className="border border-brand-overlay/[.1] rounded mt-2">
                    <div className="rounded overflow-hidden">
                      <Post
                        post={actionPost}
                        isPreview={true}
                        className="shadow-none"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="mx-4 my-2">
                <div className="flex items-center">
                  <Label
                    className={`flex items-center cursor-pointer hover:opacity-80 transition select-none ${
                      actionType == "share" ||
                      !!currentAttachments[0]?.documentLink
                        ? "pointer-events-none opacity-40"
                        : ""
                    }`}
                  >
                    <div className="text-purple-secondary">
                      <ImageIcon
                        color="currentColor"
                        weight="light"
                        size={24}
                      />
                    </div>
                    <div className="text-sm text-white/[.6] font-normal ml-2">
                      Photo/Video
                    </div>
                    <Input
                      id="image-select"
                      type="file"
                      value=""
                      onInput={(event) =>
                        handleChangeMedia(
                          Array.from(event.currentTarget.files ?? [])
                        )
                      }
                      className="hidden"
                      accept={`image/*${
                        currentAttachments.length === 0 ? ", video/*" : ""
                      }`}
                    />
                  </Label>
                  <Label
                    className={`flex items-center cursor-pointer hover:opacity-80 transition select-none ml-4 ${
                      actionType == "share" || currentAttachments.length >= 1
                        ? "pointer-events-none opacity-40"
                        : ""
                    }`}
                  >
                    <div className="text-white">
                      <FilePdf color="currentColor" weight="light" size={24} />
                    </div>
                    <div className="text-sm text-white/[.6] font-normal ml-2">
                      Attach PDF
                    </div>
                    <Input
                      id="pdf-select"
                      type="file"
                      value=""
                      onInput={async (event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) {
                          const previewFile = await generateThumbnail(file);
                          if (!previewFile) {
                            return;
                          }

                          await handleChangeMedia([previewFile]);
                          const pdfUrl = await upload(file, false);
                          const { attachments: updatedMedia } = getValues();
                          setValue("attachments", [
                            { ...updatedMedia[0], documentLink: pdfUrl },
                          ]);
                        }
                      }}
                      className="hidden"
                      accept=".pdf"
                      disabled={currentAttachments.length >= 1}
                    />
                  </Label>
                  <div
                    className="flex items-center text-white/[.6] ml-4 cursor-pointer hover:opacity-80 transition"
                    onClick={() => setVisibleEmoji(!visibleEmoji)}
                  >
                    <div className="text-success">
                      <Smiley color="currentColor" weight="light" size={24} />
                    </div>
                    <div className="text-sm ml-2">Emoji</div>
                    <CaretDown
                      color="currentColor"
                      weight="bold"
                      size={16}
                      className="ml-1"
                    />
                  </div>
                </div>
              </div>
              {visibleEmoji && (
                <div className="absolute left-10 bottom-10 z-20">
                  <EmojiPicker onSelect={onEmojiClick} />
                </div>
              )}
            </div>
            {showCategories ? (
              <div className="w-full md:border-l border-white/[.12] md:w-80">
                <CategorySelector
                  control={control}
                  name="categories"
                  error={
                    errors.categories
                      ? "Please select at least one category."
                      : ""
                  }
                />
              </div>
            ) : currentAttachments.length > 1 ? (
              <div className="w-full md:border-l border-white/[.12] md:w-80">
                <MediaSelector
                  control={control}
                  name="attachments"
                  userId={account._id}
                  postId={actionPost?._id}
                  error={
                    errors.attachments
                      ? "Please select up to 5 photo/videos."
                      : ""
                  }
                  onHandleChange={handleChangeMedia}
                  onRemoveMedia={handleRemoveMedia}
                />
              </div>
            ) : null}
          </div>
          <div className="border-t border-white/[.12] flex items-center justify-between p-4">
            <Button
              variant="text"
              className="text-primary font-medium"
              onClick={closeModal}
            >
              Cancel
            </Button>
            {showCategories ? (
              <Button
                type="button"
                variant="gradient-primary"
                className="w-48 font-medium"
                disabled={loading || !isValid}
                loading={loading}
                onClick={() => handleSubmit(onSubmit)()}
              >
                {actionType == "edit" ? "Save Updates" : "Post"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="gradient-primary"
                className="w-48 font-medium"
                disabled={
                  loading ||
                  (actionType !== "share" && currentAttachments.length > 5)
                }
                loading={loading}
                onClick={() => {
                  if (actionType === "share") {
                    handleSubmit(onSubmit)();
                    return;
                  }

                  setShowCategories(true);
                }}
              >
                {actionType == "share" ? "Share" : "Next"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </ModalDialog>
  );
};

export default EditPostModal;
