import { FC, HTMLProps } from "react";

interface LabelProps extends HTMLProps<HTMLLabelElement> {}

const Label: FC<LabelProps> = (props: LabelProps) => {
  const className =
    "leading-6 text-white text-sm font-bold tracking-wide " +
    (props.htmlFor ? "cursor-pointer" : "") +
    " " +
    (props.className ?? "");
  return (
    <label {...props} className={className}>
      {props.children}
    </label>
  );
};

export default Label;
