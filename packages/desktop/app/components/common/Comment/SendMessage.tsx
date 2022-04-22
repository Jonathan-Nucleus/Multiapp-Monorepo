import React, { FC, useState, useRef } from "react";
import { PaperPlaneRight, Image as PhotoImage, Smiley } from "phosphor-react";
import { useFetchUploadLink } from "desktop/app/graphql/mutations/posts";

import Button from "../Button";
import Avatar from "../Avatar";
import Input from "../Input";

interface SendMessageProps {
  onSend: (message: string, mediaUrl?: string) => void;
  avatar?: string;
  size: number;
  placeholder?: string;
  message?: string;
}

const SendMessage: FC<SendMessageProps> = ({
  onSend,
  avatar,
  size,
  placeholder,
  message = "",
}: SendMessageProps) => {
  const [fetchUploadLink] = useFetchUploadLink();

  const [comment, setComment] = useState(message);
  const [visibleEmoji, setVisibleEmoji] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedFile = useRef<File | undefined>(undefined);

  const sendMessage = async (): Promise<void> => {
    if (!comment || comment === "") return;
    await onSend(comment, mediaUrl);
    setComment("");
  };

  const onEmojiClick = (event: any, emojiObject: any) => {
    setComment(comment + " " + emojiObject.emoji + " ");
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
      setMediaUrl(remoteName);
    } catch (err) {
      console.log("Error fetching upload link", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <Avatar src={avatar} size={size} />
        <div className="flex items-center justify-between p-4 ml-2 flex-1 relative">
          <Input
            placeholder={placeholder}
            className="bg-background-DEFAULT pl-4 pr-16 text-sm tracking-wide font-light"
            shape="pill"
            value={comment}
            onChange={(event) => {
              setComment(event.currentTarget.value);
            }}
          />
          <Button
            variant="text"
            className="absolute right-12"
            onClick={() => setVisibleEmoji(!visibleEmoji)}
          >
            <Smiley size={20} color="#00AAE0" weight="fill" />
          </Button>
          <div className="absolute right-6 cursor-pointer">
            <div className="relative">
              <Button variant="text">
                <PhotoImage size={20} color="#00AAE0" weight="fill" />
              </Button>
              <Input
                id="image-select"
                type="file"
                value=""
                onInput={async (evt) => {
                  const file = evt.currentTarget.files?.[0];
                  selectedFile.current = file;

                  if (file) {
                    await uploadMedia(file);
                  }
                }}
                accept="image/*, video/*"
                className="w-2 h-2 absolute right-0 top-3 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
        <Button variant="text" className="flex-shrink-0" onClick={sendMessage}>
          <PaperPlaneRight size={32} />
        </Button>
      </div>
      {visibleEmoji && (
        <div className="absolute right-0 w-full z-50">
          {/*<Picker*/}
          {/*  onEmojiClick={onEmojiClick}*/}
          {/*  skinTone={SKIN_TONE_MEDIUM_DARK}*/}
          {/*  pickerStyle={{ width: "100%" }}*/}
          {/*/>*/}
        </div>
      )}
    </div>
  );
};

export default SendMessage;
