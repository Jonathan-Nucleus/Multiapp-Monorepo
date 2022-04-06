import { forwardRef, HTMLProps } from "react";

interface InputProps extends HTMLProps<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={
        "rounded-sm bg-white bg-opacity-95 shadow-sm shadow-inner block w-full leading-7 border-2 border-transparent focus:border-2 focus:border-primary focus-visible:outline-none px-2 py-1 " +
          props.className ?? ""
      }
    />
  );
});

Input.displayName = "Input";

export default Input;
