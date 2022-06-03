import { FC, useState, useEffect, useRef } from "react";
import {
  Buildings,
  User,
  X,
  GlobeHemisphereEast,
  CircleWavy,
  Image as ImageIcon,
  Smiley,
  CaretDown,
} from "phosphor-react";

import CategorySelector, { categoriesSchema } from "./CategorySelector";
import Avatar from "desktop/app/components/common/Avatar";
import Button from "desktop/app/components/common/Button";
import Input from "desktop/app/components/common/Input";
import Dropdown, {
  DropdownProps,
} from "desktop/app/components/common/Dropdown";
import Label from "desktop/app/components/common/Label";

import { SubmitHandler, useForm, DefaultValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useCreatePost,
  useFetchUploadLink,
} from "shared/graphql/mutation/posts";
import { Audience, PostCategory } from "backend/graphql/posts.graphql";
import { Audiences } from "backend/graphql/enumerations.graphql";
import { PostSummary } from "shared/graphql/fragments/post";
import { useEditPost } from "shared/graphql/mutation/posts/useEditPost";
import ModalDialog from "../../../common/ModalDialog";
import { hrefFromLink, isWebLink, LINK_PATTERN } from "shared/src/patterns";
import LinkPreview from "../LinkPreview";
import _ from "lodash";
import EmojiPicker from "../../../common/EmojiPicker";
import MentionTextarea, { mentionTextSchema } from "../MentionTextarea";
import { useAccountContext } from "shared/context/Account";
import MediaPreview from "./MediaPreview";

const audienceOptions = [
  {
    icon: <GlobeHemisphereEast color="currentColor" weight="fill" size={24} />,
    title: "Everyone",
    value: "EVERYONE",
  },
  {
    icon: (
      <div className="text-success relative">
        <CircleWavy color="currentColor" weight="fill" size={24} />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold scale-75 text-white">
          QP
        </div>
      </div>
    ),
    title: "Qualified Purchasers",
    value: "QUALIFIED_PURCHASER",
  },
  {
    icon: (
      <div className="text-success relative">
        <CircleWavy color="currentColor" weight="fill" size={24} />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold scale-75 text-white">
          QC
        </div>
      </div>
    ),
    title: "Qualified Clients",
    value: "QUALIFIED_CLIENT",
  },
  {
    icon: (
      <div className="text-success relative">
        <CircleWavy color="currentColor" weight="fill" size={24} />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold scale-75 text-white">
          AI
        </div>
      </div>
    ),
    title: "Accredited Investors",
    value: "ACCREDITED",
  },
];

type FormValues = {
  user: string;
  audience: Audience;
  media?: {
    url: string;
    aspectRatio: number;
  };
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
    media: yup
      .object({
        url: yup.string().required().default(""),
        aspectRatio: yup.number().required().default(1.58),
      })
      .default(undefined)
      .notRequired(),
    categories: categoriesSchema,
    mentionInput: mentionTextSchema,
  })
  .required();

interface EditPostModalProps {
  post?: PostSummary;
  file?: File;
  show: boolean;
  onClose: () => void;
}

const EditPostModal: FC<EditPostModalProps> = ({
  post,
  file,
  show,
  onClose,
}) => {
  const account = useAccountContext();
  const [userOptions, setUserOptions] = useState<
    DropdownProps["items"][number][]
  >([]);
  const [selectedFile, setSelectedFile] = useState(file);
  const [showCategories, setShowCategories] = useState(!!post);
  const [createPost] = useCreatePost();
  const [editPost] = useEditPost();
  const [fetchUploadLink] = useFetchUploadLink();
  const [loading, setLoading] = useState(false);
  const [visibleEmoji, setVisibleEmoji] = useState(false);
  const [linkPreview, setLinkPreview] = useState<string>();
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
  const suggestionsContainer = useRef<HTMLDivElement>(null);
  const changeCallback = useRef(
    _.debounce((body: string | undefined) => {
      if (!body) {
        setLinkPreview(undefined);
        return;
      }
      const result = body.matchAll(LINK_PATTERN);
      const matches = Array.from(result);
      if (matches.length > 0) {
        const validLink = matches
          .map((match) => match[0])
          .find((link) => isWebLink(link));
        if (validLink && validLink != linkPreview) {
          setLinkPreview(hrefFromLink(validLink));
        }
      } else {
        setLinkPreview(undefined);
      }
    }, 500)
  ).current;
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: schema.cast({ categories: [] }) as DefaultValues<FormValues>,
    mode: "onChange",
  });

  useEffect(() => {
    if (account) {
      if (account.companies.length > 0) {
        setUserOptions([
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
        ]);
      }
      if (post) {
        reset(
          schema.cast({
            user: account._id == post.userId ? account._id : post.userId,
            media: post.media
              ? {
                  aspectRatio: post.media.aspectRatio,
                  url: post.media.url,
                }
              : undefined,
            categories: post.categories,
            mentionInput: {
              body: post.body,
            },
          }) as DefaultValues<FormValues>
        );
        changeCallback(post.body);
      } else {
        reset(schema.cast({ user: account._id }) as DefaultValues<FormValues>);
      }
    }
  }, [account, changeCallback, post, reset]);

  const onEmojiClick = (emojiObject: any) => {
    const body = getValues("mentionInput.body");
    setValue("mentionInput.body", body + emojiObject.native);
    setVisibleEmoji(false);
    inputRef?.current?.focus();
  };

  useEffect(() => {
    const subscription = watch(({ mentionInput, media }, { name }) => {
      if (name == "mentionInput.body" && !media) {
        changeCallback(mentionInput?.body);
      }
    });
    return () => subscription.unsubscribe();
  }, [changeCallback, watch]);

  const onSubmit: SubmitHandler<FormValues> = async ({
    user,
    audience,
    media,
    categories,
    mentionInput,
  }) => {
    setLoading(true);
    try {
      if (!post) {
        const { data } = await createPost({
          variables: {
            post: {
              audience,
              categories,
              media,
              body: mentionInput.body,
              mentionIds: mentionInput.mentions?.map((mention) => mention.id),
              ...(user != account?._id ? { companyId: user } : {}),
            },
          },
        });
        if (data && data.createPost) {
          closeModal();
          return;
        }
      } else {
        const { data } = await editPost({
          variables: {
            post: {
              _id: post._id,
              userId: post.userId,
              audience,
              categories,
              media,
              body: mentionInput.body,
              mentionIds: mentionInput.mentions?.map((mention) => mention.id),
            },
          },
        });
        if (data && data.editPost) {
          closeModal();
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    const uploadMedia = async (file: File) => {
      setLoading(true);
      const { data } = await fetchUploadLink({
        variables: {
          localFilename: file.name,
          type: "POST",
          id: account._id,
        },
      });
      if (!data || !data.uploadLink) {
        console.log("Error fetching upload link");
        return undefined;
      }
      const { remoteName, uploadUrl } = data.uploadLink;
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
      });
      setLoading(false);
      return remoteName;
    };
    if (selectedFile) {
      console.log("uploading");
      uploadMedia(selectedFile).then((url) => {
        setValue("media", { ...watch("media"), url });
      });
    }
  }, [account._id, fetchUploadLink, selectedFile, setValue, watch]);

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
              {post ? "Edit Post" : "Create Post"}
            </div>
            <Button variant="text">
              <X color="white" weight="bold" size={24} onClick={closeModal} />
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
                  />
                </div>
              </div>
              <div
                ref={suggestionsContainer}
                className="min-h-0 flex flex-col flex-grow overflow-y-auto mt-2 px-4"
              >
                <div className="flex-grow">
                  <MentionTextarea
                    inputRef={inputRef}
                    control={control}
                    name="mentionInput"
                    suggestionsContainer={
                      suggestionsContainer.current ?? undefined
                    }
                  />
                </div>
                <MediaPreview
                  media={watch("media") ? post?.media : undefined}
                  file={selectedFile}
                  postId={post?._id}
                  userId={post?.userId ?? account._id}
                  onLoaded={(aspectRatio) => {
                    const media = watch("media");
                    setValue("media", { ...media, aspectRatio });
                  }}
                  onRemove={() => {
                    setSelectedFile(undefined);
                    setValue("media", undefined);
                  }}
                />
                {linkPreview && !watch("media") && !selectedFile && (
                  <div className="my-2">
                    <LinkPreview link={linkPreview} />
                  </div>
                )}
              </div>
              <div className="mx-4 my-2">
                <div className="flex items-center">
                  <Label className="flex items-center cursor-pointer hover:opacity-80 transition">
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
                      onInput={async (event) => {
                        setSelectedFile(event.currentTarget.files?.[0]);
                      }}
                      className="hidden"
                      accept="image/*, video/*"
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
            {showCategories && (
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
            )}
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
                disabled={loading}
                loading={loading}
                onClick={() => handleSubmit(onSubmit)()}
              >
                {post ? "Save Updates" : "Post"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="gradient-primary"
                className="w-48 font-medium"
                disabled={loading}
                loading={loading}
                onClick={() => setShowCategories(true)}
              >
                NEXT
              </Button>
            )}
          </div>
        </div>
      </form>
    </ModalDialog>
  );
};

export default EditPostModal;
