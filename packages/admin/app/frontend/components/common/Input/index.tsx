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
        className={`${
          props.disabled ? "bg-gray-100 text-gray-700" : "bg-white text-black"
        } bg-opacity-95 rounded-lg leading-7 border border-gray-700 focus:border-2
          focus:border-blue-600 focus-visible:outline-none px-2 py-1
          h-12 w-full ${props.className ?? ""} ${
          isInvalid ? "bg-red-200 border-error border" : ""
        }`}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
