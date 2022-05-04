import { FC } from "react";

import Card from "../../../../common/Card";

const SkeletonFundProfilePage: FC = () => {
  return (
    <div className="container mx-auto mt-5 lg:px-4 max-w-screen-xl">
      <div className="lg:grid grid-cols-3">
        <div className="col-span-2">
          <Card className="hidden lg:block rounded-xl p-0 border-0">
            <div className="flex flex-row h-72 bg-white/[.12]">
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
            </div>
          </Card>
          <Card className="hidden lg:block rounded-xl p-0 border-0 mt-8">
            <div className="flex-shrink-0 h-72 bg-white/[.12] relative"></div>
          </Card>
          <div className="p-0 border-0 mt-8">
            <div className="flex-shrink-0 w-1/4 h-6 bg-white/[.12] relative rounded-sm"></div>
            <div className="flex-shrink-0 w-full h-3 bg-white/[.12] relative rounded-sm mt-8"></div>
            <div className="flex-shrink-0 w-10/12 h-3 bg-white/[.12] relative rounded-sm mt-4"></div>
            <div className="flex-shrink-0 w-11/12 h-3 bg-white/[.12] relative rounded-sm mt-4"></div>
          </div>
          <div className="grid grid-cols-4 gap-x-4 mt-5 w-10/12">
            <div className="flex-shrink-0 h-3 bg-white/[.12] relative rounded-md mt-4"></div>
            <div className="flex-shrink-0 h-3 bg-white/[.12] relative rounded-md mt-4"></div>
            <div className="flex-shrink-0 h-3 bg-white/[.12] relative rounded-md mt-4"></div>
            <div className="flex-shrink-0 h-3 bg-white/[.12] relative rounded-md mt-4"></div>
          </div>
          <Card className="hidden lg:block rounded-xl mt-8 bg-purple p-8 border-white/[.12]">
            <div className="grid grid-cols-4 gap-x-4 divide-x border-white/[.12] divide-inherit">
              <div className="flex-shrink-0 h-3 bg-purple/[.24] relative rounded-md"></div>
              <div className="flex-shrink-0 h-3 bg-purple/[.24] relative rounded-md"></div>
              <div className="flex-shrink-0 h-3 bg-purple/[.24] relative rounded-md"></div>
              <div className="flex-shrink-0 h-3 bg-purple/[.24] relative rounded-md"></div>
            </div>
          </Card>
          <Card className="hidden lg:block rounded-xl p-0 border-0 mt-8">
            <div className="flex-shrink-0 h-72 bg-white/[.12] relative"></div>
          </Card>
        </div>
        <div className="ml-8">
          <Card className="rounded-lg bg-background-card">
            <div className="flex flex-col divide-y border-white/[.12] divide-inherit">
              <div className="flex items-center flex-col">
                <div className="w-[72px] h-[72px] relative bg-skeleton rounded-full"></div>
                <div className="bg-skeleton w-1/2 h-8 rounded-full mt-8"></div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 py-8 mt-8">
                <div className="flex-shrink-0 h-3 bg-purple/[.24] relative rounded-md"></div>
                <div className="flex-shrink-0 h-3 bg-purple/[.24] relative rounded-md"></div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 py-8">
                <div className="flex-shrink-0 h-3 bg-purple/[.24] relative rounded-md"></div>
                <div className="flex-shrink-0 h-3 bg-purple/[.24] relative rounded-md"></div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 py-8">
                <div className="flex-shrink-0 h-3 bg-purple/[.24] relative rounded-md"></div>
                <div className="flex-shrink-0 h-3 bg-purple/[.24] relative rounded-md"></div>
              </div>
              <div className="grid grid-cols-1 gap-x-4 py-8">
                <div className="flex-shrink-0 h-3 bg-purple/[.24] relative rounded-md"></div>
              </div>
              <div className="grid grid-cols-1 gap-x-4 pt-8 pb-4">
                <div className="flex-shrink-0 h-3 bg-purple/[.24] relative rounded-md"></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SkeletonFundProfilePage;
