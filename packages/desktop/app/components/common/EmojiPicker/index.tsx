import { FC } from "react";
import { Picker, PickerProps } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

type EmojiPickerProps = PickerProps;

const EmojiPicker: FC<EmojiPickerProps> = (props) => {
  return <Picker {...props} />;
};

export default EmojiPicker;
