import { FC } from "react";
import Card from "../../../../common/Card";

const Skeleton: FC = () => {
  return (
    <div className="relative animate-pulse">
      <Card className="rounded-none lg:rounded-2xl border-brand-overlay/[.1] p-0">
        <div>
          <div className="w-full h-16 lg:h-32 bg-skeleton-background relative border-b border-white/[.12]" />
          <div className="flex items-center relative mx-5 -mt-12">
            <div className="relative">
              <div className="w-[120px] h-[120px] bg-skeleton rounded-full" />
            </div>
            <div className="flex flex-col w-full ml-8">
              <div className="w-1/4 h-6 mt-8 bg-skeleton rounded-md" />
            </div>
          </div>
          <div className="flex flex-col px-5">
            <div className="w-1/3 h-1 mt-4 bg-skeleton rounded-lg" />
            <div className="w-full h-1 mt-4 bg-skeleton rounded-lg" />
            <div className="w-10/12 h-1 mt-4 bg-skeleton rounded-lg" />
          </div>
        </div>
        <div className="border-t border-white/[.12] pb-12 mt-6" />
      </Card>
    </div>
  );
};

export default Skeleton;