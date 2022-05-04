import { FC } from "react";
import Card from "../../../../common/Card";

const PostsList: FC = () => {
  return (
    <Card>
      <div className="flex items-center">
        <div className="w-[88px] h-[88px] rounded-full bg-skeleton" />
        <div className="flex-1 p-4">
          <div className="w-1/4 h-2 bg-skeleton rounded-lg" />
          <div className="w-1/3 h-2 mt-8 bg-skeleton rounded-lg" />
        </div>
      </div>
      <div className="w-10/12 h-2 mt-12 bg-skeleton rounded-lg mt-4" />
      <div className="w-6/12 h-2 bg-skeleton rounded-lg mt-4" />
      <div className="w-8/12 h-2 bg-skeleton rounded-lg mt-4" />
    </Card>
  );
};

export default PostsList;
