import { forwardRef, HTMLProps } from "react";

interface RadioProps extends HTMLProps<HTMLInputElement> {}

const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      type="radio"
      className={`w-4 h-4 bg-gray-50 rounded border border-gray-300
        focus:bg-primary accent-primary focus-visible:outline-none ${
          props.className ?? ""
        }`}
    />
  );
});

Radio.displayName = "Radio";

export default Radio;
