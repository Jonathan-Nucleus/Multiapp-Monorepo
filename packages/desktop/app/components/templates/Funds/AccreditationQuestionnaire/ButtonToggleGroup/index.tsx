import { FC } from "react";

type ToggleValue = "yes" | "no" | undefined;

interface ButtonToggleGroupProps {
  value: ToggleValue;
  onChange: (value: ToggleValue) => void;
}

const ButtonToggleGroup: FC<ButtonToggleGroupProps> = ({ value, onChange }) => {
  return (
    <>
      <div className="inline-flex items-center bg-white border border-primary divide-x rounded overflow-hidden">
        <div
          className={
            "block text-sm font-semibold cursor-pointer px-4 py-3 " +
            (value == "yes" ? "text-white bg-primary" : "text-primary")
          }
          onClick={() => onChange("yes")}
        >
          YES
        </div>
        <div
          className={
            "block text-sm font-semibold cursor-pointer px-4 py-3 " +
            (value == "no" ? "text-white bg-primary" : "!text-primary")
          }
          onClick={() => onChange("no")}
        >
          NO
        </div>
      </div>
    </>
  );
};

export default ButtonToggleGroup;