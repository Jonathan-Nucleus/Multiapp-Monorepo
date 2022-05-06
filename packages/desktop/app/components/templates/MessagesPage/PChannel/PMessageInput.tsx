import React, { useCallback, useContext } from "react";
import { ImageDropzone, FileUploadButton } from "react-file-utils";
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
import { Smiley, Image as ImageIcon, PaperPlaneRight } from "phosphor-react";
import { LightningBoltSmall } from "../Icons";

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

const PMessagingInput: React.FC<MessageInputProps<StreamType>> = () => {
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
      <div className="flex items-end justify-between w-full">
        <div className="flex-auto text-black bg-white rounded-md border-2 hover:border-primary">
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
            <EmojiPicker />
            <div className="px-2">
              <UploadsPreview />
            </div>
            <div className="relative">
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
              <div className="absolute top-0 right-4 h-full flex items-center">
                <div
                  className="mx-1"
                  role="button"
                  aria-roledescription="button"
                  onClick={messageInput.openEmojiPicker}
                  ref={messageInput.emojiPickerRef}
                >
                  <Smiley color="#00AAE0" weight="fill" size="24" />
                </div>

                <div
                  className="mx-1"
                  role="button"
                  aria-roledescription="button"
                >
                  <FileUploadButton
                    multiple
                    handleFiles={messageInput.uploadNewFiles}
                  >
                    <ImageIcon color="#00AAE0" size="24" />
                  </FileUploadButton>
                </div>
              </div>
            </div>
          </ImageDropzone>
        </div>
        <div
          role="button"
          aria-roledescription="button"
          onClick={_debounce(messageInput.handleSubmit, DEBOUNCE_INTERVAL)}
          className="m-1"
        >
          <PaperPlaneRight size="32" />
        </div>
      </div>
    </div>
  );
};

export default PMessagingInput;
