import { FC, HTMLProps } from "react";

type ContainerProps = HTMLProps<HTMLDivElement> & {
  fluid?: boolean;
};

const Container: FC<ContainerProps> = ({
  fluid = false,
  children,
  className,
  ...props
}) => {
  return (
    <>
      {fluid ? (
        <div>{children}</div>
      ) : (
        <div
          className={`2xl:max-w-[1420px] xl:max-w-screen-xl sm:mx-6 xl:mx-auto ${
            className ?? ""
          }`}
          {...props}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default Container;
