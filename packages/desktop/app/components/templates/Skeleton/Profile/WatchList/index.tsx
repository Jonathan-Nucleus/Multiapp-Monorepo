import { FC } from "react";

import Card from "../../../../common/Card";
const WatchList: FC = () => {
  return (
    <div className="flex items-center">
      <div className="w-[88px] h-[88px] rounded-lg bg-skeleton" />
      <div className="flex-1 pl-4">
        <div className="w-full h-2 bg-skeleton rounded-lg" />
      </div>
    </div>
  );
};

export default WatchList;
