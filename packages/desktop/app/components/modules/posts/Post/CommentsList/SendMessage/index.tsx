import React, { FC, useState } from "react";
import { Image as PhotoImage, PaperPlaneRight, Smiley } from "phosphor-react";
import { useFetchUploadLink } from "shared/graphql/mutation/posts";

import Button from "../../../../../common/Button";
import Avatar from "../../../../../common/Avatar";
import Input from "../../../../../common/Input";
import EmojiPicker from "../../../../../common/EmojiPicker";
import Label from "../../../../../common/Label";
import { useAccountContext } from "shared/context/Account";
import MediaPreview from "../../../EditPostModal/MediaPreview";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface SendMessageProps {
  type: "create-comment" | "edit-comment";
  message?: string;
  placeholder?: string;
  onSend: (message: string, mediaUrl?: string) => Promise<void>;
  onCancel?: () => void;
}

type FormValues = {
  body: string;
  mediaUrl?: string;
};

const schema = yup
  .object({
    body: yup.string().required("Required"),
    mediaUrl: yup.string().notRequired(),
  })
  .required();

const SendMessage: FC<SendMessageProps> = ({
  type,
  message = "",
  placeholder,
  onSend,
  onCancel,
}: SendMessageProps) => {
  const account = useAccountContext();
  const [fetchUploadLink] = useFetchUploadLink();
  const [visibleEmoji, setVisibleEmoji] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const {
    handleSubmit,
    register,
    setFocus,
    setValue,
    watch,
    reset,
    formState: { isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: { body: message, mediaUrl: undefined },
    mode: "onChange",
  });
  const onEmojiClick = (emojiObject: any) => {
    setValue("body", watch("body") + emojiObject.native);
    setVisibleEmoji(false);
    setFocus("body");
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
  const onSubmit: SubmitHandler<FormValues> = async ({ body }) => {
    setLoading(true);
    let mediaUrl;
    if (selectedFile) {
      mediaUrl = await uploadMedia(selectedFile);
    }
    await onSend(body, mediaUrl);
    reset();
    setSelectedFile(undefined);
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
          <div className="flex-grow mx-2">
            <div className="flex items-center relative">
              <Input
                placeholder={placeholder}
                className="bg-background pl-4 pr-16 text-xs font-light !rounded-full"
                disabled={loading}
                {...register("body")}
              />
              <div className="absolute flex items-center right-4">
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
                    onInput={(event) => {
                      setSelectedFile(event.currentTarget.files?.[0]);
                    }}
                    accept="image/*, video/*"
                    className="hidden"
                  />
                </Label>
              </div>
            </div>
            <MediaPreview
              file={selectedFile}
              userId={account._id}
              onLoaded={() => {}}
              onRemove={() => setSelectedFile(undefined)}
            />
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
