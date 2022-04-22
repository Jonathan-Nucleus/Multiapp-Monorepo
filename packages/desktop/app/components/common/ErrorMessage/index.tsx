import { ReactElement, HTMLProps } from "react";
import {
  FieldValues,
  Path,
  UseFormStateReturn,
  FieldError,
} from "react-hook-form";

interface ErrorMessageProps<TFieldValues> extends HTMLProps<HTMLDivElement> {
  name?: Path<TFieldValues>;
  errors?: UseFormStateReturn<TFieldValues>["errors"];
}

function ErrorMessage<TFieldValues = FieldValues>({
  name,
  errors,
  ...props
}: ErrorMessageProps<TFieldValues>): ReactElement {
  const error =
    name &&
    ((errors as unknown as Record<Path<TFieldValues>, FieldError>)?.[name] as
      | FieldError
      | undefined);

  return !!error ? (
    <div
      {...props}
      className={`font-normal text-error text-sm mt-1 ${props.className ?? ""}`}
    >
      {error.message?.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ))}
    </div>
  ) : (
    <></>
  );
}

export default ErrorMessage;
