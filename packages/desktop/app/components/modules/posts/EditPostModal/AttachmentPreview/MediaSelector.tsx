import {
  ControllerProps,
  FieldValues,
  Path,
  useController,
} from "react-hook-form";
import { PlusCircle } from "phosphor-react";
import * as yup from "yup";

import Label from "../../../../common/Label";
import Input from "../../../../common/Input";
import AttachmentPreview from ".";

export const mediaSchema = yup
  .array()
  .of(
    yup.object({
      url: yup.string().required().default(""),
      aspectRatio: yup.number().required().default(1.58),
      documentLink: yup.string().default(undefined),
      file: yup.mixed(),
    })
  )
  .ensure()
  .default([])
  .max(5);

export type Media = {
  url: string;
  aspectRatio: number;
  documentLink?: string;
  file?: File;
};

export type MediaSelectorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  error?: string;
  userId: string;
  postId?: string;
  onHandleChange: (files: File[]) => void;
  onRemoveMedia?: (index: number) => void;
};

function MediaSelector<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({
  error,
  userId,
  postId,
  onHandleChange,
  onRemoveMedia,
  ...controllerProps
}: MediaSelectorProps<TFieldValues, TName>) {
  const { field } = useController(controllerProps);
  return (
    <div className="flex flex-col h-full">
      <div className="text-white/[.6] p-4 pb-3 border-t md:border-t-0 border-white/[.12]">
        <div className="text-sm">Photos</div>
        <div className="text-xs mt-2">
          Select a{" "}
          <strong className="text-white/[0.8]">max of 5 photo & videos</strong>{" "}
          to make your post easier to find and visible to more people.
        </div>
        {error && <div className="text-xs text-error mt-2">{error}</div>}
      </div>
      <div className="mb-2 border border-l-0 border-r-0 px-4 border-white/[.12] bg-background-cardDark">
        <div className="flex items-center h-10">
          <Label
            className={
              "flex items-center cursor-pointer hover:opacity-80 transition select-none"
            }
          >
            <div className="text-purple-secondary">
              <PlusCircle color="currentColor" weight="light" size={24} />
            </div>
            <div className="text-sm text-white/[.6] font-normal ml-2">
              Add Photo/Video
            </div>
            <Input
              id="image-select"
              type="file"
              value=""
              onChange={(event) =>
                onHandleChange(Array.from(event.currentTarget.files ?? []))
              }
              className="hidden"
              accept={`image/*${field.value.length === 0 ? ", video/*" : ""}`}
            />
          </Label>
        </div>
      </div>
      <div className="py-2 min-h-0 overflow-y-auto">
        {field.value.map((media: Media, index: number) => (
          <div key={media.url} className="w-full h-40 flex-shrink-0 px-8 mb-2">
            <AttachmentPreview
              attachment={media}
              className="my-0"
              maxHeight={150}
              file={media.file}
              onLoaded={(aspectRatio) => {
                const updatedMedia = [...field.value];
                updatedMedia[index] = {
                  ...field.value[index],
                  aspectRatio,
                };
                field.onChange(updatedMedia);
              }}
              onRemove={() => onRemoveMedia && onRemoveMedia(index)}
              userId={userId}
              postId={postId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MediaSelector;
