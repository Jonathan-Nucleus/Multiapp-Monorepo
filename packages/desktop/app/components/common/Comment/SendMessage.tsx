import React, { FC, useRef, useState } from "react";
import { Image as PhotoImage, PaperPlaneRight, Smiley } from "phosphor-react";
import { Picker } from "emoji-mart";
import { useFetchUploadLink } from "shared/graphql/mutation/posts";
import "emoji-mart/css/emoji-mart.css";

import Button from "../Button";
import Avatar from "../Avatar";
import Input from "../Input";
import { UserSummary } from "shared/graphql/fragments/user";

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
    setComment(comment + " " + emojiObject.native + " ");
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
      <div className="flex items-center">
        <Avatar user={user} size={avatarSize} />
        <div className="flex items-center justify-between p-4 flex-1 relative">
          <Input
            placeholder={placeholder}
            className="bg-background-DEFAULT pr-16 pl-4 text-sm font-light tracking-wide"
            shape="pill"
            value={comment}
            onChange={(event) => {
              setComment(event.currentTarget.value);
            }}
          />
          <Button
            variant="text"
            className="absolute right-14"
            onClick={() => setVisibleEmoji(!visibleEmoji)}
          >
            <Smiley size={20} color="#00AAE0" weight="fill" />
          </Button>
          <div className="absolute right-8 cursor-pointer">
            <div className="relative">
              <Button variant="text">
                <PhotoImage size={20} color="#00AAE0" weight="fill" />
              </Button>
              <Input
                id="image-select"
                type="file"
                value=""
                onInput={async (evt) => {
                  selectedFile.current = evt.currentTarget.files?.[0];
                }}
                accept="image/*, video/*"
                className="w-2 h-2 absolute right-0 top-3 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
        <Button
          variant="text"
          className="flex-shrink-0"
          loading={loading}
          onClick={sendMessage}
        >
          <PaperPlaneRight size={32} />
        </Button>
      </div>
      {visibleEmoji && (
        <div className="absolute right-0 w-full z-50">
          <Picker onSelect={onEmojiClick} style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default SendMessage;
