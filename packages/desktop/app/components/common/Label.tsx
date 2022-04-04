import { FC, PropsWithChildren } from "react";

type LabelProps = PropsWithChildren<{
  id?: string;
  for?: string;
  className?: string;
}>;

const Label: FC<LabelProps> = (props: LabelProps) => {
  const className =
    "leading-6 text-white text-sm font-bold tracking-wide " +
    (props.for ? "cursor-pointer" : "") +
    " " +
    (props.className ?? "");
  return (
    <label
      id={props.id}
      htmlFor={props.for}
      className={className}
    >
      {props.children}
    </label>
  );
};

export default Label;
