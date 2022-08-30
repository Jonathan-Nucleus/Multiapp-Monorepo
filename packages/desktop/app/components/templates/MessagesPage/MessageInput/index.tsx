import React, { FC, useEffect, useRef, useState } from "react";
import Button from "../../../common/Button";
import { Image as PhotoImage, PaperPlaneRight, Smiley } from "phosphor-react";
import Label from "../../../common/Label";
import Input from "../../../common/Input";
import AttachmentPreview from "../../../modules/posts/EditPostModal/AttachmentPreview";
import EmojiPicker from "../../../common/EmojiPicker";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAccountContext } from "shared/context/Account";
import MentionTextarea from "../../../modules/posts/MentionTextarea";
import { Channel } from "shared/context/Chat/types";
import Spinner from "../../../common/Spinner";

type FormValues = {
  mentionInput: {
    body?: string;
    mentions: {
      id: string;
      name: string;
    }[];
  };
};

const schema = yup
  .object({
    mentionInput: yup
      .object({
        body: yup.string(),
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
    mediaUrl: yup.string().notRequired(),
  })
  .required();

interface MessageInputProps {
  channel: Channel;
}

const MessageInput: FC<MessageInputProps> = ({ channel }) => {
  const account = useAccountContext();
  const [loading, setLoading] = useState(false);
  const [visibleEmoji, setVisibleEmoji] = useState(false);
  const [selectedMedias, setSelectedMedias] = useState<
    { file: File; uploading: boolean; uri?: string; type: string }[]
  >([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { handleSubmit, getValues, setValue, control, reset, watch } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  useEffect(() => {
    setValue("mentionInput.body", "");
  }, [channel, setValue]);
  const uploadFile = async (file: File) => {
    const media = {
      file,
      uploading: true,
      uri: "",
      type: file.type.includes("image") ? "image" : "video",
    };
    const _selectedMedias = [...selectedMedias, media];
    setSelectedMedias(_selectedMedias);
    const result = file.type.includes("image")
      ? await channel.sendImage(file)
      : await channel.sendFile(file);
    media.uploading = false;
    media.uri = result.file;
    _selectedMedias.splice(_selectedMedias.length - 1, 1);
    setSelectedMedias([..._selectedMedias, media]);
  };
  const onEmojiClick = (emojiObject: any) => {
    const body = getValues("mentionInput.body");
    setValue("mentionInput.body", body + emojiObject.native);
    setVisibleEmoji(false);
    inputRef.current?.focus();
  };
  const onSubmit: SubmitHandler<FormValues> = async ({ mentionInput }) => {
    const attachments = selectedMedias.map((media) => ({
      image_url: media.uri,
      type: media.type,
    }));
    if (attachments.length == 0 && !mentionInput.body) {
      return;
    }
    setLoading(true);
    await channel.sendMessage({
      text: mentionInput?.body,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
    await channel.update();
    reset();
    setSelectedMedias([]);
    setLoading(false);
  };
  return (
    <div className="relative w-full pl-4 pr-2 py-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={loading ? "pointer-events-none opacity-60" : ""}
      >
        <div className="flex">
          <div className="flex-grow">
            <div className="relative">
              <div className="w-full bg-white rounded-sm text-xs text-black py-3">
                <div className="max-h-28 overflow-y-auto pl-4 pr-10">
                  <MentionTextarea
                    inputRef={inputRef}
                    name="mentionInput"
                    placeholder={""}
                    control={control}
                    type="chat"
                    suggestionsContainer={undefined}
                    onKeyDown={(event) => {
                      if (loading) {
                        event.preventDefault();
                      } else if (event.key == "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSubmit(onSubmit)();
                      }
                    }}
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
                      if (file) {
                        await uploadFile(file);
                      }
                    }}
                    accept="image/*, video/*"
                    className="hidden"
                  />
                </Label>
              </div>
            </div>
            <div className="flex flex-wrap justify-end -mx-2">
              {selectedMedias.map((media, index) => (
                <div key={index} className="px-2">
                  <div className="w-40 h-32 bg-black rounded-lg overflow-hidden relative">
                    <AttachmentPreview
                      file={media.file}
                      userId={account._id}
                      onLoaded={() => {}}
                      onRemove={() => {
                        const _selectedMedias = [...selectedMedias];
                        _selectedMedias.splice(index, 1);
                        setSelectedMedias(_selectedMedias);
                      }}
                    />
                    {media.uploading && (
                      <div className="bg-black/[.5] absolute inset-0 flex items-center justify-center">
                        <Spinner size={20} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-start mt-1 ml-2">
            <Button
              type="submit"
              variant="text"
              className="py-0"
              disabled={
                selectedMedias.filter((item) => !item.uploading).length == 0 &&
                !watch("mentionInput.body")
              }
            >
              <PaperPlaneRight size={32} />
            </Button>
          </div>
        </div>
      </form>
      {visibleEmoji && (
        <div className="absolute right-12 bottom-10 z-50">
          <EmojiPicker onSelect={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
