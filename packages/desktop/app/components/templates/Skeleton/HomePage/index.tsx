import { FC, useState } from "react";

import CompanyCard from "./CompanyCard";
import ProfileCard from "./ProfileCard";
import FeaturedProfessionals from "./FeaturedProfessionals";
import AddPost from "./AddPost";
import PostsList from "./PostsList";
import InviteFriends from "./InviteFriends";
import WatchList from "./WatchList";

const SkeletonHomePage: FC = () => {
  return (
    <div className="flex flex-row mt-5 lg:mt-20 px-2">
      <div className="w-80 hidden lg:block flex-shrink-0 mx-4">
        <ProfileCard />
        <div className="mt-12">
          <CompanyCard />
        </div>
      </div>
      <div className="min-w-0 flex-grow px-4 mt-12">
        <FeaturedProfessionals />
        <div className="max-w-3xl mx-auto">
          <AddPost />
          <div className="mt-12">
            <PostsList />
          </div>
        </div>
      </div>
      <div className="w-80 hidden lg:block flex-shrink-0 mx-4">
        <InviteFriends />
        <div className="mt-5">
          <WatchList />
        </div>
      </div>
    </div>
  );
};

export default SkeletonHomePage;
