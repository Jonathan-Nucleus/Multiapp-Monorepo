import React, { FC, useRef, useState } from "react";
import { Image as PhotoImage, PaperPlaneRight, Smiley } from "phosphor-react";
import { useFetchUploadLink } from "shared/graphql/mutation/posts";

import Button from "../../../../../common/Button";
import Avatar from "../../../../../common/Avatar";
import Input from "../../../../../common/Input";
import { UserSummary } from "shared/graphql/fragments/user";
import EmojiPicker from "../../../../../common/EmojiPicker";
import Label from "../../../../../common/Label";

type User = UserSummary;

interface SendMessageProps {
  user?: User;
  avatarSize?: number;
  message?: string;
  placeholder?: string;
  onSend: (message: string, mediaUrl?: string) => void;
}

const SendMessage: FC<SendMessageProps> = ({
  onSend,
  avatarSize = 36,
  placeholder,
  message = "",
  user,
}: SendMessageProps) => {
  const [fetchUploadLink] = useFetchUploadLink();
  const [comment, setComment] = useState(message);
  const [visibleEmoji, setVisibleEmoji] = useState(false);
  const [loading, setLoading] = useState(false);
  const selectedFile = useRef<File | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async (): Promise<void> => {
    if ((!comment || comment.trim() === "") && !selectedFile.current) return;
    if (selectedFile.current) {
      await uploadMedia(selectedFile.current);
    } else {
      await onSend(comment);
      setComment("");
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setComment(comment + emojiObject.native);
    setVisibleEmoji(false);
    inputRef?.current?.focus();
  };

  const uploadMedia = async (file: File): Promise<string | undefined> => {
    setLoading(true);
    try {
      const { data } = await fetchUploadLink({
        variables: {
          localFilename: file.name,
          type: "POST",
        },
      });
      if (!data || !data.uploadLink) {
        console.log("Error fetching upload link");
        return;
      }

      const { remoteName, uploadUrl } = data.uploadLink;
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
      });
      await onSend(comment, remoteName);
      selectedFile.current = undefined;
      setComment("");
    } catch (err) {
      console.log("Error fetching upload link", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center py-3">
        <Avatar user={user} size={avatarSize} />
        <div className="flex items-center justify-between flex-1 relative mx-2">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            className="bg-background pl-4 pr-16 text-xs font-light !rounded-full"
            value={comment}
            onChange={(event) => setComment(event.currentTarget.value)}
          />
          <Button
            variant="text"
            className="absolute right-10"
            onClick={() => setVisibleEmoji(!visibleEmoji)}
          >
            <Smiley size={20} color="#00AAE0" weight="fill" />
          </Button>
          <div className="absolute right-4 cursor-pointer">
            <Label htmlFor="image-select" className="hover:opacity-80">
              <PhotoImage
                size={20}
                color="currentColor"
                weight="fill"
                className="text-primary"
              />
            </Label>
            <Input
              id="image-select"
              type="file"
              value=""
              onInput={async (evt) => {
                selectedFile.current = evt.currentTarget.files?.[0];
              }}
              accept="image/*, video/*"
              className="hidden"
            />
          </div>
        </div>
        <Button
          variant="text"
          className="flex-shrink-0"
          disabled={loading}
          onClick={sendMessage}
        >
          <PaperPlaneRight size={32} />
        </Button>
      </div>
      {visibleEmoji && (
        <div className="absolute right-10 z-50">
          <EmojiPicker onSelect={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default SendMessage;
