import { FC } from "react";

const Skeleton: FC = () => {
  return (
    <>
      <div className="px-3 lg:px-0 animate-pulse">
        <div className="text-xl text-white font-medium invisible">
          Companies
        </div>
        <div className="divide-y divide-inherit border-white/[.12]">
          <div className="py-3">
            <div className="flex items-center">
              <div className="w-14 h-14 flex flex-shrink-0 rounded-lg overflow-hidden relative bg-skeleton" />
              <div className="flex-grow ml-4 bg-skeleton h-4 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Skeleton;