// This file augments project packages that are built with previous version of
// react that are not compatible with the new React v18 types. The packages
// augmented here should be monitored closely and updated to version built
// on React 18 as soon as possible. Ideally, this file should not exist.

import { PickerProps } from "emoji-mart";
import { MentionsInputProps } from "react-mentions";

declare module "react-file-utils" {
  export declare const ImageDropzone: React.PropsWithChildren<
    React.FC<ImageDropzoneProps>
  >;
}

declare module "emoji-mart" {
  export declare const Picker: React.FC<PickerProps>;
}
