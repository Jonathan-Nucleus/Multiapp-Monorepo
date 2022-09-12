import { ReactElement, HTMLProps } from "react";
import {
  FieldValues,
  Path,
  UseFormStateReturn,
  FieldError,
} from "react-hook-form";
import dot from "dot-object";

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
    (dot.pick(
      name,
      errors as unknown as Record<Path<TFieldValues>, FieldError>
    ) as FieldError | undefined);

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
