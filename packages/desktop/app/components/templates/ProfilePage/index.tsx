import { FC, useState, useEffect } from "react";

import Button from "../../common/Button";
import CompanyList from "./Companies";
import Profile from "./Profile";
import PostsList from "../../common/PostsList";
import FeaturedPosts from "../../common/FeaturedPosts";
import FundsList from "../../common/FundsList";
import Card from "../../common/Card";
import { useFetchPosts } from "desktop/app/graphql/queries";
import { useFetchFunds } from "desktop/app/graphql/queries/marketplace";

const UserProfile: FC = () => {
  const { data, refetch, loading: postsLoading } = useFetchPosts();
  const { data: fundsData, loading: fundsLoading } = useFetchFunds();
  const posts = data?.posts ?? [];
  const funds = fundsData?.funds ?? [];

  if (fundsLoading) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col p-0 mt-10 md:flex-row md:px-2">
        <div className="min-w-0 mx-0 md:mx-4">
          <Profile />

          <div className="w-full block lg:hidden">
            <CompanyList />
          </div>
          {funds.length > 0 && <FundsList funds={funds} type="profile" />}
          {posts.length > 0 && <FeaturedPosts posts={posts} />}
          <PostsList posts={posts} />
        </div>
        <div className="w-96 hidden lg:block flex-shrink-0 mx-4">
          <CompanyList />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
