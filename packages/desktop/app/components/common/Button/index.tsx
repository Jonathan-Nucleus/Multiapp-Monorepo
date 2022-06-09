import { FC, HTMLProps } from "react";
import Spinner from "../Spinner";

export interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  type?: "button" | "submit" | "reset" | undefined;
  variant: "primary" | "outline-primary" | "gradient-primary" | "text";
  loading?: boolean;
}

const Button: FC<ButtonProps> = ({
  type = "button",
  variant,
  disabled,
  className,
  loading,
  onClick,
  children,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center font-bold tracking-widest focus:outline-none rounded-full transition ${
        variant == "primary"
          ? "text-sm text-white bg-primary hover:bg-primary/75 disabled:bg-gray-500 disabled:pointer-events-none px-4 py-2"
          : ""
      } ${
        variant == "outline-primary"
          ? "text-sm text-primary border border-primary hover:bg-primary/25 disabled:border-gray-500 disabled:text-gray-500 disabled:pointer-events-none active:bg-transparent px-4 py-2"
          : ""
      } ${
        variant == "gradient-primary"
          ? "text-sm text-white bg-gradient-to-r from-[#844AFF] to-primary disabled:bg-gray-500 disabled:bg-none disabled:text-black hover:opacity-80 disabled:pointer-events-none px-4 py-2"
          : ""
      } ${
        variant == "text"
          ? "text-sm disabled:text-gray-500 hover:opacity-80 disabled:pointer-events-none active:opacity-80 py-2"
          : ""
      } ${className ?? ""} relative`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      <div
        className={`flex items-center justify-center ${
          loading ? "invisible" : ""
        }`}
      >
        {children}
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="text-white" />
        </div>
      )}
    </button>
  );
};

export default Button;
