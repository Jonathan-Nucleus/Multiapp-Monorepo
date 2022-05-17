import React, { FC } from "react";
import Card from "../../../../common/Card";

const Skeleton: FC = () => {
  return (
    <Card className="p-0 animate-pulse">
      <div className="border-b border-white/[.12] p-4">
        <div className="text-white invisible">Invite Your Friends</div>
      </div>
      <div className="p-4">
        <div className="w-1/2 h-2  bg-skeleton rounded-lg mt-4" />
        <div className="w-full h-8 bg-skeleton rounded-lg mt-4" />
        <div className="w-2/3 h-2 bg-skeleton rounded-lg mt-8" />
        <div className="w-1/2 h-2 bg-skeleton rounded-lg mt-4" />
      </div>
    </Card>
  );
};

export default Skeleton;
