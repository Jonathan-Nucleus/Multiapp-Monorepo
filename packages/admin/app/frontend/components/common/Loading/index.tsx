import { FC } from "react";

const Loading: FC = () => {
  return (
    <div className="flex justify-center">
      <div
        style={{ borderTopColor: "transparent" }}
        className="w-12 h-12 border-4 border-blue-400 border-double rounded-full animate-spin"
      ></div>
    </div>
  );
};

export default Loading;
