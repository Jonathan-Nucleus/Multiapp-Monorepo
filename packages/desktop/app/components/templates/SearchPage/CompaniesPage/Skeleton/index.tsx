import { FC } from "react";
import Card from "../../../../common/Card";

const Skeleton: FC = () => {
  return (
    <>
      <div className="animate-pulse mb-4">
        <Card className="bg-background-header border-none rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-14 h-14 flex flex-shrink-0 rounded-lg bg-skeleton" />
            <div className="w-32 h-4 bg-skeleton rounded ml-4" />
          </div>
        </Card>
      </div>
    </>
  );
};

export default Skeleton;
