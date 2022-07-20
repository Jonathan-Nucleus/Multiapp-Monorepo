import { forwardRef, HTMLProps } from "react";

interface TextareaProps extends HTMLProps<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        className={`accent-primary focus-visible:outline-none border-2 border-transparent focus:border-primary ${
          className ?? ""
        }`}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
