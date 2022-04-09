import { forwardRef, HTMLProps } from "react";

interface TextareaProps extends HTMLProps<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        className={
          "accent-primary focus-visible:outline-none " + props.className ?? ""
        }
      />
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
