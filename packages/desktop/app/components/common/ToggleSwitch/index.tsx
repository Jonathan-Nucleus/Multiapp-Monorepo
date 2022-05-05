import { ReactElement } from "react";
import { Switch } from "@headlessui/react";
import {
  FieldValues,
  Path,
  useController,
  UseFormReturn,
} from "react-hook-form";

interface ToggleSwitch<TFieldValues> {
  name: Path<TFieldValues>;
  size?: "lg" | "md" | "sm";
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  control: UseFormReturn<TFieldValues>["control"];
}

function ToggleSwitch<TFieldValues = FieldValues>({
  name,
  size = "md",
  disabled,
  onChange,
  control,
}: ToggleSwitch<TFieldValues>): ReactElement {
  const { field } = useController({
    name,
    control,
  });
  const checked = !!field.value;
  let containerSize = "";
  let thumbSize = "";
  let translator = "";
  if (size == "lg") {
    containerSize = "w-24 h-10";
    thumbSize = "w-8 h-8";
    translator = checked ? "translate-x-8" : "translate-x-2";
  } else if (size == "md") {
    containerSize = "w-14 h-8";
    thumbSize = "w-7 h-7";
    translator = checked ? "translate-x-6" : "translate-x-1";
  } else if (size == "sm") {
    containerSize = "w-7 h-4";
    thumbSize = "w-[14px] h-[14px]";
    translator = checked ? "translate-x-3" : "translate-x-0.5";
  }
  return (
    <>
      <Switch
        className={`${
          checked ? "bg-green-dark" : "bg-dark-secondary/[.32]"
        } relative inline-flex items-center rounded-full transition-colors duration-200 
          ${disabled ? "opacity-40" : ""}
          ${containerSize}
        `}
        disabled={disabled}
        checked={checked}
        onChange={(checked) => {
          field.onChange(checked);
          onChange && onChange(checked);
        }}
      >
        <span className="sr-only">Enable notifications</span>
        <span
          className={`${translator} ${thumbSize} 
          inline-block transform rounded-full bg-white transition duration-200 ease-in-out`}
        />
      </Switch>
    </>
  );
}

export default ToggleSwitch;