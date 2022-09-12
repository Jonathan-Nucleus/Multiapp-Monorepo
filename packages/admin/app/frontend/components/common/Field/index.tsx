import { ReactElement, HTMLProps, PropsWithChildren } from "react";
import { FieldValues, Path, UseFormReturn, FieldError } from "react-hook-form";
import dot from "dot-object";

import Input from "../Input";
import Label from "../Label";
import ErrorMessage from "../ErrorMessage";
import Select from "../Select";
import Textarea from "../Textarea";

interface OptionProps {
  label: string;
  value: string;
}

interface FieldProps<TFieldValues>
  extends PropsWithChildren<HTMLProps<HTMLInputElement>> {
  name: Path<TFieldValues>;
  register: UseFormReturn<TFieldValues>["register"];
  state: UseFormReturn<TFieldValues>["formState"];
  label?: string;
  selectBox?: boolean;
  options?: OptionProps[];
  textarea?: boolean;
  rows?: number;
  textareaClassName?: string;
}

function Field<TFieldValues = FieldValues>({
  name,
  register,
  state,
  label,
  ref: _refIgnored, // Remove ref definition from HTMLInputElement
  className,
  selectBox = false,
  options = [],
  textarea = false,
  rows = 5,
  textareaClassName,
  ...inputProps
}: FieldProps<TFieldValues>): ReactElement {
  const { errors } = state;
  const errorMessage = dot.pick(
    name,
    errors as unknown as Record<Path<TFieldValues>, FieldError>
  ) as FieldError | undefined;

  return (
    <div className={`mb-4 flex flex-col ${className ?? ""}`}>
      {label && (
        <Label htmlFor={name} name={name} errors={errors}>
          {label}
        </Label>
      )}
      {selectBox ? (
        <Select
          options={options}
          isInvalid={!!errorMessage}
          {...register(name)}
          id={name}
          disabled={inputProps.disabled}
        />
      ) : textarea ? (
        <Textarea
          id={name}
          {...register(name)}
          className={textareaClassName ?? ""}
          rows={rows}
          maxLength={inputProps.maxLength}
          disabled={inputProps.disabled}
        />
      ) : (
        <Input
          id={name}
          isInvalid={!!errorMessage}
          {...register(name)}
          {...inputProps}
        />
      )}
      <ErrorMessage name={name} errors={errors} />
    </div>
  );
}

Field.displayName = "Field";

export default Field;
