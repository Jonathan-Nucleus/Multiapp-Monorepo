import { FC, PropsWithChildren } from "react";

type OnboardingLayoutProps = PropsWithChildren<unknown>;

const OnboardingLayout: FC<OnboardingLayoutProps> = ({ children }) => {
  return <div className="max-w-md mx-auto px-3">{children}</div>;
};

export default OnboardingLayout;
