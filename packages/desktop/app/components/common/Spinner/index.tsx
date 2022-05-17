import { FC, HTMLProps } from "react";
import { Spinner as SpinnerIcon } from "phosphor-react";

interface SpinnerProps extends HTMLProps<HTMLSpanElement> {
  size?: number;
}

const Spinner: FC<SpinnerProps> = ({ size = 16, className }) => {
  return (
    <span className={`inline-block animate-spin text-primary ${className ?? ""}`}>
      <SpinnerIcon size={size} weight="fill" color="currentColor" />
    </span>
  );
};

export default Spinner;