import { CheckCircle, Info } from "phosphor-react";
import { FC } from "react";
import { toast as toaster } from "react-toastify";

interface ToastProps {
  variant?: "success" | "error" | "default";
  message: string;
}

const Toast: FC<ToastProps> = ({ variant = "success", message }) => {
  return (
    <div className="bg-black/[.8] rounded-lg overflow-hidden">
      <div
        className={`min-w-[320px] flex items-center ${
          variant == "success" ? "bg-success/[.7]" : ""
        } ${variant == "error" ? "bg-error/[.7]" : ""} px-3 py-2`}
      >
        {variant == "success" && (
          <CheckCircle
            className="flex-shrink-0 text-white"
            size={32}
            weight="light"
          />
        )}
        {variant == "error" && (
          <Info
            className="flex-shrink-0 text-white/[.6]"
            size={32}
            weight="light"
          />
        )}
        <div className="text-sm text-white ml-2 mr-5">{message}</div>
      </div>
    </div>
  );
};

export const toast = {
  success: (message: string) => {
    toaster(<Toast variant="success" message={message} />);
  },
  error: (message: string) => {
    toaster(<Toast variant="error" message={message} />);
  },
};
