import { FC, HTMLProps } from "react";

interface InputProps extends HTMLProps<HTMLInputElement> {
  id?: string;
  type: "email" | "text" | "password" | "hidden" | "number";
  name?: string;
  disabled?: boolean;
  placeholder?: string;
  autocomplete?: string;
  required?: boolean;
  props?: HTMLProps<HTMLInputElement>;
}

const Input: FC<InputProps> = ({
  id,
  type,
  name,
  disabled,
  placeholder,
  autocomplete,
  props,
}) => {
  return (
    <input
      id={id}
      type={type}
      name={name}
      className="rounded-sm bg-white bg-opacity-95 shadow-sm shadow-inner block w-full leading-7 border-2 border-transparent focus:border-2 focus:border-primary focus-visible:outline-none px-2 py-1"
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autocomplete}
      {...props}
    />
  );
};

export default Input;
