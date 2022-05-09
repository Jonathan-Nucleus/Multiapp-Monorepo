import { ReactElement } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

/**
 * Type definition describing props for the RatingControl component
 */
export interface SegmentedInputProps<TFieldValues extends FieldValues> {
  /** Ordered array of options */
  options: {
    title: string | React.ReactNode;
    value: string;
  }[];

  /** The name of this input field */
  name: Path<TFieldValues>;
  register: UseFormReturn<TFieldValues>["register"];
  formState: UseFormReturn<TFieldValues>["formState"];
  className?: string;
}

function SegmentedInput<TFieldValues extends FieldValues>({
  options,
  name,
  register,
  formState,
  className,
}: SegmentedInputProps<TFieldValues>): ReactElement {
  const registerProps = register(name);
  return (
    <div className={`flex flex-row items-center h-10 text-white ${className}`}>
      {options.map(({ title, value }, index) => (
        <div key={value} className="flex-1">
          <input
            id={`${name}-${value}`}
            key={value}
            type="radio"
            value={value}
            className="peer hidden"
            {...registerProps}
          />
          <label
            htmlFor={`${name}-${value}`}
            className={`block w-100 text-center text-sm cursor-pointer px-4 py-3
              overflow-hidden font-light border border-white/[0.12]
              peer-checked:bg-primary-solid/[0.24] peer-checked:font-semibold
              peer-checked:border peer-checked:border-primary-solid
              ${
                index === 0
                  ? "rounded-l-full"
                  : index === options.length - 1
                  ? "rounded-r-full"
                  : ""
              }`}
          >
            {title}
          </label>
        </div>
      ))}
    </div>
  );
}

export default SegmentedInput;
