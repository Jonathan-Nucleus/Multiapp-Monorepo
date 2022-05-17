import React, { FC } from "react";

const Skeleton: FC = () => {
  return (
    <div className="animate-pulse">
      <div className="hidden md:block">
        <div className="bg-secondary/[.27] border border-white/[.12] rounded-t">
          <div className="flex px-3 py-4">
            <div className="w-16 h-16 bg-skeleton rounded-lg" />
            <div className="flex-grow mx-4">
              <div className="w-32 h-3 bg-skeleton rounded" />
            </div>
          </div>
        </div>
        <div className="bg-secondary/[.12] rounded-b border border-white/[.12]">
          <div className="flex items-center px-3 py-3">
            <div className="w-10 h-10 rounded-full bg-skeleton" />
          </div>
        </div>
      </div>
      <div className="block md:hidden p-4">
        <div className="flex items-center">
          <div>
            <div className="w-16 h-16 rounded-full bg-skeleton" />
          </div>
          <div className="flex-grow mx-4">
            <div className="w-full h-3 rounded bg-skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
