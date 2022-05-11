import { FC } from "react";
import FundCard from "./FundCard";

const Skeleton: FC = () => {
  return (
    <div className="animate-pulse">
      {[...Array(3)].map((ignored, index) => (
        <div key={index} className="mb-6">
          <FundCard />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;