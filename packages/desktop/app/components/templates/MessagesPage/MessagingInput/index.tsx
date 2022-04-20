import React, { useCallback, useContext } from "react";
import { ImageDropzone } from "react-file-utils";
import {
  ChatAutoComplete,
  EmojiPicker,
  MessageInputProps,
  UploadsPreview,
  useChannelStateContext,
  useMessageInputContext,
} from "stream-chat-react";
import _debounce from "lodash/debounce";

import { GiphyContext, StreamType } from "../types";
import { EmojiIcon, LightningBoltSmall, SendIcon } from "../Icons";

/**
 * Debounce time in milliseconds to prevent sending duplicate messages in
 * quick succession.
 */
const DEBOUNCE_INTERVAL = 50;

const GiphyIcon = () => (
  <div className="giphy-icon__wrapper">
    <LightningBoltSmall />
    <p className="giphy-icon__text">GIPHY</p>
  </div>
);

const MessagingInput: React.FC<MessageInputProps> = () => {
  const { giphyState, setGiphyState } = useContext(GiphyContext);
  const { acceptedFiles, maxNumberOfFiles, multipleUploads } =
    useChannelStateContext<StreamType>();

  const messageInput = useMessageInputContext<StreamType>();

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      const { value } = event.target;

      const deletePressed =
        event.nativeEvent instanceof InputEvent &&
        event.nativeEvent.inputType === "deleteContentBackward";

      if (messageInput.text.length === 1 && deletePressed) {
        setGiphyState(false);
      }

      if (
        !giphyState &&
        messageInput.text.startsWith("/giphy") &&
        !messageInput.numberOfUploads
      ) {
        event.target.value = value.replace("/giphy", "");
        setGiphyState(true);
      }

      messageInput.handleChange(event);
    },
    [giphyState, messageInput.numberOfUploads, messageInput.text]
  );

  return (
    <div className="p-4 border-y border-white/[.15]">
      <ImageDropzone
        accept={acceptedFiles}
        handleFiles={messageInput.uploadNewFiles}
        multiple={multipleUploads}
        disabled={
          (maxNumberOfFiles !== undefined &&
            messageInput.numberOfUploads >= maxNumberOfFiles) ||
          giphyState
        }
      >
        <UploadsPreview />
        <div className="flex items-center justify-between w-full">
          <div className="flex-auto mr-2 relative">
            {giphyState && !messageInput.numberOfUploads && <GiphyIcon />}
            <ChatAutoComplete
              onChange={onChange}
              handleSubmit={_debounce(
                messageInput.handleSubmit,
                DEBOUNCE_INTERVAL
              )}
              rows={1}
              placeholder="Send a message"
            />
            <div
              className="str-chat__textarea-emoji"
              role="button"
              aria-roledescription="button"
              onClick={messageInput.openEmojiPicker}
              ref={messageInput.emojiPickerRef}
            >
              <EmojiIcon />
            </div>
            <EmojiPicker />
          </div>
          <div
            role="button"
            aria-roledescription="button"
            onClick={_debounce(messageInput.handleSubmit, DEBOUNCE_INTERVAL)}
          >
            <SendIcon />
          </div>
        </div>
      </ImageDropzone>
    </div>
  );
};

export default MessagingInput;
