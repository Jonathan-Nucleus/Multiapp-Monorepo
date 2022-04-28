import { forwardRef, HTMLProps } from "react";

interface CardProps extends HTMLProps<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={
        "bg-background-card rounded-2xl shadow-md shadow-black border border-white/[.12] p-4 overflow-hidden " +
        (props.className ?? "")
      }
    >
      {props.children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;
