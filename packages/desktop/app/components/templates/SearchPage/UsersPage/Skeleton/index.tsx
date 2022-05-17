import { FC } from "react";
import Card from "../../../../common/Card";

const Skeleton: FC = () => {
  return (
    <>
      <div className="animate-pulse">
        <Card className="bg-background-header border-none rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-full bg-skeleton" />
            <div className="ml-2 flex-grow">
              <div className="flex items-center">
                <div className="w-32 h-4 bg-skeleton rounded" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Skeleton;