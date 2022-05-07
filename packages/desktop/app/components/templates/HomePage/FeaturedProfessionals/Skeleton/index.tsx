import { FC } from "react";
import Card from "../../../../common/Card";
import Button from "../../../../common/Button";

const Skeleton: FC = () => {
  return (
    <div className="animate-pulse">
      <div className="font-medium text-xl text-white invisible">
        Featured Professionals
      </div>
      <Card className="border-0 overflow-hidden mt-5 px-4 pt-4 pb-0 mb-8">
        <div className="flex items-center">
          {[...Array(5)].map((ignored, index) => (
            <div key={index}>
              <div className="mx-2">
                <div className="w-40 h-40 relative rounded-lg bg-skeleton" />
                <div className="text-center my-2">
                  <div className="invisible">
                    <Button
                      variant="text"
                      className="text-sm text-primary font-normal tracking-normal py-0"
                    >
                      {"Follow"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Skeleton;