import React, { FC } from "react";
import Card from "../../../../../../common/Card";

const FundCard: FC = () => {
  return (
    <>
      <Card className="hidden lg:block rounded-xl p-0 border-0">
        <div className="flex flex-row bg-secondary/[.27]">
          <div className="flex-shrink-0 w-72 h-72 bg-white/[.12] relative"></div>
          <div className="flex flex-col flex-grow px-5">
            <div className="flex">
              <div className="w-24 h-24 bg-white/[.12] rounded-b relative overflow-hidden mr-4"></div>
              <div className="self-center flex-grow">
                <div className="bg-white/[.12] w-3/5 h-3 rounded-lg"></div>
              </div>
            </div>
            <div className="bg-white/[.12] w-10/12 h-2 rounded-lg mt-4"></div>
            <div className="bg-white/[.12] w-8/12 h-2 rounded-lg mt-4"></div>
          </div>
          <div className="bg-white/[.12] w-px my-5" />
          <div className="w-64 flex-shrink-0 flex flex-col items-center justify-between p-4">
            <div className="w-[120px] h-[120px] bg-white/[.12] rounded-full" />
            <div className="w-full h-6 mt-8 bg-white/[.12] rounded-full" />
          </div>
        </div>
        <div className="bg-background-cardDark py-6"></div>
      </Card>
      <Card className="block lg:hidden rounded-none p-0">
        <div className="h-12 bg-secondary/[.27] relative"></div>
        <div className="relative px-4 pt-8 bg-secondary/[.27]">
          <div className="w-16 h-16 bg-white/[.12] rounded relative overflow-hidden -mt-16"></div>
          <div className="bg-white/[.12] w-3/5 h-3 rounded-lg mt-4"></div>
          <div className="flex flex-wrap -mx-1 py-2"></div>
          <div className="border-t border-white/[.12] py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 relative bg-white/[.12] rounded-full"></div>
              <div className="bg-white/[.12] w-1/2 h-3 rounded-lg ml-3"></div>
            </div>
          </div>
        </div>
        <div className="bg-secondary/[.12] border-y border-white/[.12] py-6 opacity-60"></div>
      </Card>
    </>
  );
};

export default FundCard;
