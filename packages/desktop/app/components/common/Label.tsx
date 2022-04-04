import { FC, PropsWithChildren } from "react";

type LabelProps = PropsWithChildren<{
  id?: string;
  for?: string;
}>;

const Label: FC<LabelProps> = (props: LabelProps) => {
  return (
    <label
      id={props.id}
      htmlFor={props.for}
      className="leading-6 text-white text-sm font-bold tracking-wide"
    >
      {props.children}
    </label>
  );
};

export default Label;
