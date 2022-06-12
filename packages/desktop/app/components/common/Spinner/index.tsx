import { FC, HTMLProps } from "react";
import { Spinner as SpinnerIcon } from "phosphor-react";

interface SpinnerProps extends HTMLProps<HTMLSpanElement> {
  size?: number;
  indeterminate?: boolean;
  barWidth?: number;
  percent?: number;
}

const Spinner: FC<SpinnerProps> = ({
  size = 16,
  indeterminate = true,
  barWidth = 8,
  percent = 0,
  className,
}) => {
  const circumference = 90 * 2 * Math.PI;
  if (indeterminate) {
    return (
      <span
        className={`inline-block animate-spin text-primary ${className ?? ""}`}
      >
        <SpinnerIcon size={size} weight="fill" color="currentColor" />
      </span>
    );
  } else {
    return (
      <span className={className ?? ""}>
        <svg
          className="inline-block text-gray-400 stroke-primary -rotate-90"
          width={size}
          height={size}
          viewBox="0 0 200 200"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            r="90"
            cx="100"
            cy="100"
            fill="none"
            stroke="currentColor"
            strokeWidth={20}
          />
          <circle
            className="transition-[stroke-dashoffset]"
            r="90"
            cx="100"
            cy="100"
            fill="none"
            strokeWidth={20}
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (Math.min(percent, 100) / 100) * circumference
            }
          />
        </svg>
      </span>
    );
  }
};

export default Spinner;
