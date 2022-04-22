import { forwardRef, HTMLProps } from "react";

export interface InputProps extends HTMLProps<HTMLInputElement> {
  isInvalid?: boolean;
  shape?: "pill" | "rounded";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ isInvalid, shape = "rounded", ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`${
          shape === "pill" ? "rounded-full" : "rounded-lg"
        } bg-white bg-opacity-95 shadow-sm shadow-inner
          block w-full leading-7 border-2 border-transparent focus:border-2
          focus:border-primary focus-visible:outline-none px-2 py-1 text-black
          h-9 mt-0.5 ${props.className ?? ""} ${
          isInvalid ? "bg-red-200 border-error border" : ""
        }`}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
