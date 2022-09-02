import React, { FC, useRef, useState } from "react";
import { Image as PhotoImage, PaperPlaneRight, Smiley } from "phosphor-react";
import { useFetchUploadLink } from "shared/graphql/mutation/posts";

import Button from "../../../../../common/Button";
import Avatar from "../../../../../common/Avatar";
import Input from "../../../../../common/Input";
import EmojiPicker from "../../../../../common/EmojiPicker";
import Label from "../../../../../common/Label";
import { useAccountContext } from "shared/context/Account";
import AttachmentPreview from "../../../EditPostModal/AttachmentPreview";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MentionTextarea from "../../../MentionTextarea";
import {
  Media,
  mediaSchema,
} from "../../../EditPostModal/AttachmentPreview/MediaSelector";

interface SendMessageProps {
  type: "create-comment" | "edit-comment";
  message?: string;
  attachments?: Media[];
  commentId?: string;
  placeholder?: string;
  onSend: (message: string, attachments?: Media[]) => Promise<void>;
  onCancel?: () => void;
}

type FormValues = {
  mentionInput: {
    body: string;
    mentions: {
      id: string;
      name: string;
    }[];
  };
  attachments: Media[];
};

const schema = yup
  .object({
    mentionInput: yup
      .object({
        body: yup.string().required(),
        mentions: yup
          .array()
          .of(
            yup
              .object({
                id: yup.string().required(),
                name: yup.string().required(),
              })
              .required()
          )
          .default([]),
      })
      .required(),
    attachments: mediaSchema,
  })
  .required();

const SendMessage: FC<SendMessageProps> = ({
  type,
  message = "",
  attachments = undefined,
  placeholder,
  commentId,
  onSend,
  onCancel,
}: SendMessageProps) => {
  const account = useAccountContext();
  const [fetchUploadLink] = useFetchUploadLink();
  const [visibleEmoji, setVisibleEmoji] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsContainer = useRef<HTMLDivElement>(null);
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    watch,
    formState: { isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      mentionInput: { body: message, mentions: [] },
      attachments:
        attachments?.map((item) => ({
          ...item,
          ...(item.documentLink ? {} : { documentLink: undefined }),
        })) ?? [],
    },
    mode: "onChange",
  });

  const currentAttachments = watch("attachments") ?? [];

  const onEmojiClick = (emojiObject: any) => {
    const body = getValues("mentionInput.body");
    setValue("mentionInput.body", body + emojiObject.native);
    setVisibleEmoji(false);
    inputRef.current?.focus();
  };
  const uploadMedia = async (file: File) => {
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
    try {
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
      });
    } catch (error) {
      console.log("Failed to upload media", error);
    }
    return remoteName;
  };
  const onSubmit: SubmitHandler<FormValues> = async ({
    attachments,
    mentionInput,
  }) => {
    setLoading(true);
    const sendingAttachments = attachments?.map(
      ({ url, aspectRatio, documentLink }) => ({
        url,
        aspectRatio,
        documentLink,
      })
    );
    await onSend(mentionInput.body, sendingAttachments ?? []);
    reset();
    setLoading(false);
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={loading ? "pointer-events-none opacity-60" : ""}
      >
        <div className="flex">
          <div className={type == "create-comment" ? "" : "invisible"}>
            <Avatar user={account} size={36} className="mt-0.5" />
          </div>
          <div className="flex-grow min-w-0 mx-2">
            <div ref={suggestionsContainer} className="relative">
              <div className="w-full bg-white rounded-3xl text-xs text-black py-3">
                <div className="max-h-28 overflow-y-auto pl-4 pr-10">
                  <MentionTextarea
                    inputRef={inputRef}
                    name="mentionInput"
                    placeholder={placeholder}
                    control={control}
                    type="comment"
                    suggestionsContainer={
                      suggestionsContainer.current ?? undefined
                    }
                    onKeyDown={(event) => {
                      if (event.key == "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSubmit(onSubmit)();
                      }
                    }}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="absolute flex items-center right-4 top-1">
                <Button
                  variant="text"
                  onClick={() => setVisibleEmoji(!visibleEmoji)}
                >
                  <Smiley size={20} color="#00AAE0" weight="fill" />
                </Button>
                <Label className="cursor-pointer hover:opacity-80 ml-1">
                  <PhotoImage
                    size={20}
                    color="currentColor"
                    weight="fill"
                    className="text-primary"
                  />
                  <Input
                    type="file"
                    value=""
                    onInput={async (event) => {
                      const file = event.currentTarget.files?.[0];

                      if (file != null) {
                        setValue("attachments", [
                          {
                            file: file,
                            url: (await uploadMedia(file)) ?? "",
                            aspectRatio: 1.58,
                            documentLink: undefined,
                          },
                        ]);
                      }
                    }}
                    accept="image/*, video/*"
                    className="hidden"
                  />
                </Label>
              </div>
            </div>
            {currentAttachments.length === 1 && (
              <div className={"max-w-xs mt-4"}>
                <AttachmentPreview
                  attachment={currentAttachments[0]}
                  file={
                    (currentAttachments[0].file as unknown as File) ??
                    undefined
                  }
                  userId={account._id}
                  postId={commentId}
                  onLoaded={(aspectRatio) => {
                    const newMedia = [
                      { ...currentAttachments[0], aspectRatio },
                    ];
                    setValue("attachments", newMedia);
                  }}
                  onRemove={() => {
                    setValue("attachments", []);
                  }}
                  secondary={true}
                />
              </div>
            )}
            {type == "edit-comment" && (
              <div className="ml-3">
                <Button
                  type="button"
                  variant="text"
                  className="text-xs tracking-normal font-normal text-white/[.87]"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="text"
                  className="text-xs tracking-normal font-normal text-white/[.87] ml-3"
                  disabled={!isValid}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
          {type == "create-comment" && (
            <div className="mt-1">
              <Button
                type="submit"
                variant="text"
                className="py-0"
                disabled={!isValid}
              >
                <PaperPlaneRight size={32} />
              </Button>
            </div>
          )}
        </div>
      </form>
      {visibleEmoji && (
        <div className="absolute right-10 z-50">
          <EmojiPicker onSelect={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default SendMessage;
