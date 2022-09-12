import { forwardRef, HTMLProps } from "react";

interface OptionProps {
  label: string;
  value: string;
}

export interface SelectProps extends HTMLProps<HTMLSelectElement> {
  isInvalid?: boolean;
  options: OptionProps[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ isInvalid, options, className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        {...props}
        className={`rounded-lg bg-white bg-opacity-95 shadow-sm shadow-inner
          block w-full leading-7 border border-1 border-black
          focus:border-primary focus-visible:outline-none px-2 py-1 text-black
          h-12 ${className ?? ""} ${
          isInvalid ? "bg-red-200 border-error border" : ""
        }`}
      >
        {options.map((v) => (
          <option value={v.value} key={v.value}>
            {v.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = "Select";

export default Select;
