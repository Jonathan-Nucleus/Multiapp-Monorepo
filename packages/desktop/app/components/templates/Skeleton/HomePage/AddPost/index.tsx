import { FC } from "react";

import Card from "desktop/app/components/common/Card";

const AddPost: FC = () => {
  return (
    <Card className="bg-skeleton p-4">
      <div className="flex items-center pb-4">
        <div className="w-[56px] h-[56px] rounded-full bg-skeleton-light" />
        <div className="flex-1 px-2">
          <div className="w-full h-[56px] rounded-full bg-skeleton-light" />
        </div>
        <div className="w-[56px] h-[56px] rounded-full bg-skeleton-light" />
      </div>
    </Card>
  );
};

export default AddPost;
