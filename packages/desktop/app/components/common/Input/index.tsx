import { forwardRef, HTMLProps } from "react";

export interface InputProps extends HTMLProps<HTMLInputElement> {
  isInvalid?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ isInvalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`bg-white bg-opacity-95 rounded-lg shadow-sm shadow-inner
          block w-full leading-7 border focus:border-primary 
          focus-visible:outline-none px-2 py-1 text-black
          h-9 mt-0.5 ${props.className ?? ""} ${
          isInvalid ? "bg-red-200 !border-error" : ""
        }`}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
