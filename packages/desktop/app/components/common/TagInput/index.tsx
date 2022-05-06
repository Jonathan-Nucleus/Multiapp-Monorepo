import {
  FC,
  useState,
  forwardRef,
  HTMLProps,
  KeyboardEventHandler,
} from "react";

interface RenderTagProps {
  value: string;
  onRemove: () => void;
}

export type TagRenderer = FC<RenderTagProps>;
export interface TagInputProps extends HTMLProps<HTMLInputElement> {
  tags?: string[];
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
  renderTag: FC<RenderTagProps>;
}

const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  (
    { tags = [], onAddTag, onRemoveTag, renderTag: Tag, ...inputProps },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const onKeyPress: KeyboardEventHandler<HTMLInputElement> = (evt) => {
      // Detect delete key
      if (evt.keyCode === 8) {
        if (!inputProps.value || inputProps.value === "") {
          const lastTag = tags?.[tags.length - 1];
          lastTag && onRemoveTag?.(lastTag);
        }
      }

      inputProps.onKeyDown?.(evt);
    };

    return (
      <div
        className={`flex flex-row flex-wrap bg-white rounded-sm w-full shadow-sm
        shadow-inner block leading-7 px-1 py-0 text-black mt-0.5 border-2 ${
          focused ? "border-primary" : "border-transparent"
        }`}
      >
        <div className="py-1 flex flex-row">
          {tags?.map((tag) => (
            <Tag key={tag} value={tag} onRemove={() => onRemoveTag?.(tag)} />
          ))}
        </div>
        <input
          {...inputProps}
          ref={ref}
          onFocus={(evt) => {
            setFocused(true);
            inputProps.onFocus?.(evt);
          }}
          onBlur={(evt) => {
            setFocused(false);
            inputProps.onBlur?.(evt);
          }}
          onKeyDown={onKeyPress}
          className={`bg-transparent flex-1 focus:border-0 pl-1
            focus-visible:outline-none ${inputProps.className}`}
        />
      </div>
    );
  }
);

TagInput.displayName = "TagInput";

export default TagInput;
