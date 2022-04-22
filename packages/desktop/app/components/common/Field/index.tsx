import { ReactElement, HTMLProps, PropsWithChildren } from "react";
import { FieldValues, Path, UseFormReturn, FieldError } from "react-hook-form";

import Input from "../Input";
import Label from "../Label";
import ErrorMessage from "../ErrorMessage";

interface FieldProps<TFieldValues>
  extends PropsWithChildren<HTMLProps<HTMLInputElement>> {
  name: Path<TFieldValues>;
  register: UseFormReturn<TFieldValues>["register"];
  state: UseFormReturn<TFieldValues>["formState"];
  label?: string;
  shape?: "pill" | "rounded";
}

function Field<TFieldValues = FieldValues>({
  name,
  register,
  state,
  label,
  shape = "rounded",
  ref: refIgnored, // Remove ref definition from HTMLInputElement
  className,
  children,
  ...inputProps
}: FieldProps<TFieldValues>): ReactElement {
  const { errors } = state;
  const errorMessage = (
    errors as unknown as Record<Path<TFieldValues>, FieldError>
  )[name] as FieldError | undefined;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <Label htmlFor={name} name={name} errors={errors}>
          {label}
        </Label>
      )}
      <Input
        id={name}
        isInvalid={!!errorMessage}
        {...register(name)}
        {...inputProps}
      />
      <ErrorMessage name={name} errors={errors} />
    </div>
  );
}

Field.displayName = "Field";

export default Field;
