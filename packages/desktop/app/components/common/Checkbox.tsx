import { ChangeEventHandler, FC, HTMLProps } from "react";

type CheckboxProps = {
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  props?: HTMLProps<HTMLInputElement>;
};

const Checkbox: FC<CheckboxProps> = ({
  id,
  name,
  disabled,
  required,
  className,
  onChange,
  props,
}: CheckboxProps) => {
  return (
    <input
      id={id}
      type="checkbox"
      name={name}
      className={
        "w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:bg-primary accent-primary focus-visible:outline-none " +
          className ?? ""
      }
      disabled={disabled}
      required={required}
      onChange={onChange}
      {...props}
    />
  );
};

export default Checkbox
