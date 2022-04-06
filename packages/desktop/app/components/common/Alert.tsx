import { FC, HTMLProps } from "react";

interface AlertProps extends HTMLProps<HTMLDivElement> {
  variant: "error" | "info" | "success";
}

const Alert: FC<AlertProps> = ({ variant, className, children }) => {
  let background = "";
  if (variant == "error") {
    background = "bg-error/[.3]";
  } else if (variant == "info") {
    background = "bg-info/[.3]";
  } else if (variant == "success") {
    background = "bg-success/[.3]";
  }
  background += " " + (className ?? "");
  return (
    <div className={"rounded-2xl " + background}>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Alert;
