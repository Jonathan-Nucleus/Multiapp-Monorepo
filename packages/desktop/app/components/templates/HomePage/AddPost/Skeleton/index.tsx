import { FC } from "react";
import Card from "../../../../common/Card";
import Button from "../../../../common/Button";
import { Image as ImageIcon } from "phosphor-react";

const Skeleton: FC = () => {
  return (
    <Card className="bg-skeleton p-4 animate-pulse">
      <div className="flex items-center pb-4">
        <div className="w-[56px] h-[56px] rounded-full bg-skeleton-light" />
        <div className="flex-1 px-2">
          <div className="w-full h-[56px] rounded-full bg-skeleton-light" />
        </div>
        <div className="w-[56px] h-[56px] rounded-full bg-skeleton-light" />
      </div>
      <div className="mx-16 mt-2 invisible">
        <Button variant="text">
          <ImageIcon color="white" size={24} />
          <span className="text-white opacity-60 font-normal tracking-normal ml-2">
            Photo/Video
          </span>
        </Button>
      </div>
    </Card>
  );
};

export default Skeleton;