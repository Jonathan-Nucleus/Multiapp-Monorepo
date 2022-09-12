import { forwardRef, HTMLProps } from "react";

interface TextareaProps extends HTMLProps<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        className={`${
          props.disabled ? "bg-gray-100 text-gray-700" : "bg-white text-black"
        } rounded-lg leading-7 border border-gray-700 focus:border-1 text-black
          focus:border-blue-600 focus-visible:outline-none px-2 py-1 bg-white ${
            className ?? ""
          }`}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
