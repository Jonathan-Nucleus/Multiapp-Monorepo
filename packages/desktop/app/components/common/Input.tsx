import { FC } from "react";

type InputProps = {
  id?: string;
  type: string;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
  autocomplete?: string;
  required?: boolean;
};

const Input: FC<InputProps> = ({
  id,
  type,
  name,
  disabled,
  placeholder,
  autocomplete,
  required,
}: InputProps) => {
  return (
    <input
      id={id}
      type={type}
      name={name}
      className="rounded-sm bg-white bg-opacity-95 shadow-sm shadow-inner block w-full leading-7 border-2 border-transparent focus:border-2 focus:border-primary focus-visible:outline-none px-2 py-1"
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autocomplete}
      required={required}
    />
  );
};

export default Input;
