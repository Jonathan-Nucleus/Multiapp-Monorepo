import { FC, useState } from "react";

import ProfileCard from "./ProfileCard";
import PostsList from "./PostsList";
import WatchList from "./WatchList";

const SkeletonProfilePage: FC = () => {
  return (
    <div className="flex flex-row mt-5 lg:mt-20 px-2">
      <div className="min-w-0 flex-grow px-4">
        <div className="divide-y divide-inherit border-white/[.12]">
          <ProfileCard />
          <div className="mt-4 pt-8">
            <PostsList />
          </div>
        </div>
      </div>
      <div className="w-80 hidden lg:block flex-shrink-0 mx-4">
        <WatchList />
      </div>
    </div>
  );
};

export default SkeletonProfilePage;
