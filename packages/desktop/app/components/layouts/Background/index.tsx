import { FC, HTMLProps } from "react";
import { AppPageProps } from "../../../types/next-page";

interface BackgroundProps extends HTMLProps<HTMLDivElement> {
  type: AppPageProps["background"];
}

const Background: FC<BackgroundProps> = ({
  type,
  children,
}: BackgroundProps) => {
  return (
    <div>
      {type == "default" &&
        <div className="h-screen bg-surface overflow-y-auto">
          {children}
        </div>
      }
      {type == "radial" &&
        <div className="h-screen bg-radial bg-no-repeat bg-top bg-cover overflow-y-auto">
          {children}
        </div>
      }
    </div>
  );
};

export default Background;
