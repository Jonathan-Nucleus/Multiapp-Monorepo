import { FC, useState } from "react";
import { Info, Lock } from "phosphor-react";

import FundCard from "./FundCard";

const SkeletonFundsPage: FC = () => {
  const funds = new Array(4).fill("");
  return (
    <>
      <div className="container mx-auto my-6 max-w-screen-xl lg:px-4">
        {funds!.map((fund, index) => (
          <div key={index} className="mb-6">
            <FundCard fund={fund} />
          </div>
        ))}
        <footer className="border-t border-white/[.12] mt-6 px-4 lg:px-0 pt-3">
          <div className="text-white opacity-60 flex items-center tracking-normal font-normal">
            <Info color="currentColor" weight="light" size={20} />
            <span className="ml-2">Disclosure</span>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SkeletonFundsPage;
