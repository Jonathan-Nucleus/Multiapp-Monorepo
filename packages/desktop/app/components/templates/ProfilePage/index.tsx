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
import { useAccount } from "desktop/app/graphql/queries";
import type { User } from "backend/graphql/users.graphql";

const UserProfile: FC = () => {
  const { data, refetch, loading: postsLoading } = useFetchPosts();
  const { data: fundsData, loading: fundsLoading } = useFetchFunds();
  const { data: userData, loading: userLoading } = useAccount();
  const posts = data?.posts ?? [];
  const funds = fundsData?.funds ?? [];
  const account = userData?.account;
  const companies = account?.companies ?? [];
  let members: User[] = [];
  companies.forEach((company) => (members = [...members, ...company.members]));

  if (fundsLoading || userLoading) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col p-0 mt-10 md:flex-row md:px-2">
        <div className="min-w-0 mx-0 md:mx-4">
          <Profile account={account} from="profile" members={members} />

          <div className="w-full block lg:hidden">
            <CompanyList companies={account?.companies ?? []} />
          </div>
          {funds.length > 0 && <FundsList funds={funds} type="profile" />}
          {posts.length > 0 && <FeaturedPosts posts={posts} />}
          <PostsList posts={posts} />
        </div>
        <div className="w-96 hidden lg:block flex-shrink-0 mx-4">
          <CompanyList companies={account?.companies ?? []} />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
