import { FC, useState, useEffect } from "react";
import { Plus } from "phosphor-react";

import Button from "../../common/Button";
import PostsList from "./PostsList";
import TeamMembersList from "./TeamMembers";
import FeaturedPosts from "./FeaturedPosts";
import Funds from "./Funds";
import Profile from "../../common/Profile";

const company = {
  profile: {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQha3uvPpSbN50PaGo-DL6937g63MaAgTz9RobAq7ghhNj-PbudoD8JCKpYjjz9hvBvTpo&usqp=CAU",
    name: "Michelle Jordan",
    type: "PRO",
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQha3uvPpSbN50PaGo-DL6937g63MaAgTz9RobAq7ghhNj-PbudoD8JCKpYjjz9hvBvTpo&usqp=CAU",
  },
  description:
    "This is my bio data where I will write something about myself firm with a multi-strategy hedge fund offering. It is one of the world’s largest alternative asset mangement system",
  followers: 9987,
  posts: 26,
  following: 35,
  linkedin: "https://www.linkedin.com/",
  twitter: "https://twitter.com/",
  website: "https://www.linkedin.com/",
};

const CompanyPage: FC = () => {
  return (
    <>
      <div className="flex flex-row px-2 mt-10">
        <div className="min-w-0 mx-4">
          <Profile data={company} />
          <Funds />
          <FeaturedPosts />
          <PostsList />
        </div>
        <div className="w-96 hidden lg:block flex-shrink-0 mx-4">
          <TeamMembersList />
        </div>
      </div>
    </>
  );
};

export default CompanyPage;
