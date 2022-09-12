import { FC, HTMLProps } from "react";
import Spinner from "../Spinner";

export interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  type?: "button" | "submit" | "reset";
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
      className={`inline-flex items-center justify-center font-medium tracking-wider focus:outline-none rounded-lg transition h-12 min-w-[120px] ${
        variant == "primary"
          ? "text-sm text-white bg-primary-solid hover:bg-primary-solid/75 disabled:bg-gray-500 disabled:pointer-events-none px-4 py-2"
          : ""
      } ${
        variant == "outline-primary"
          ? "text-sm text-primary-solid border border-primary-solid hover:bg-primary-solid/25 disabled:border-gray-500 disabled:text-gray-500 disabled:pointer-events-none active:bg-transparent px-4 py-2"
          : ""
      } ${
        variant == "gradient-primary"
          ? "text-sm text-white bg-gradient-to-r from-[#844AFF] to-primary-solid disabled:bg-gray-500 disabled:bg-none disabled:text-black hover:opacity-80 disabled:pointer-events-none px-4 py-2"
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
