import { FC, useState, useEffect } from "react";
import { Plus } from "phosphor-react";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/image";

import TeamMembersList from "./TeamMembers";
import PostsList from "../../common/PostsList";
import FeaturedPosts from "../../common/FeaturedPosts";
import FundsList from "../../common/FundsList";
import Card from "../../common/Card";
import Button from "../../common/Button";
import Profile from "./Profile";
import { useFetchPosts } from "desktop/app/graphql/queries";
import { useFetchFunds } from "desktop/app/graphql/queries/marketplace";
import { useAccount } from "desktop/app/graphql/queries";
import type { Company } from "backend/graphql/companies.graphql";
import type { User } from "backend/graphql/users.graphql";

interface CompanyIdProps {
  _id: string;
}

const CompanyPage: FC<CompanyIdProps> = ({ _id }) => {
  const { data, loading, refetch } = useFetchPosts();
  const { data: fundsData, loading: fundLoading } = useFetchFunds();
  const { data: accountData, loading: accountLoading } = useAccount();

  const posts = data?.posts ?? [];
  const funds = fundsData?.funds ?? [];
  const companies = accountData?.account?.companies ?? [];
  const company: Company = companies.find((v) => v._id === _id);
  let members: User[] = company?.members ?? [];

  if (fundLoading || accountLoading) {
    return null;
  }

  return (
    <div className="flex flex-col p-0 mt-10 md:flex-row md:px-2">
      <div className="min-w-0 mx-0 md:mx-4">
        {company && (
          <Profile account={company} members={members} />
        )}
        <FundsList funds={funds} type="company" />
        <FeaturedPosts posts={posts} />
        <PostsList posts={posts} />
      </div>
      <div className="w-96 hidden md:block flex-shrink-0 mx-4">
        <TeamMembersList members={members} />
      </div>
      <div className="w-full block lg:hidden">
        <div className="font-medium text-white ml-4 md:m-0">Team Members</div>
        <Card className="border-0 mt-5 bg-transparent	shadow-none">
          <Splide
            options={{
              autoWidth: true,
              rewind: true,
              lazyLoad: "nearby",
              cover: true,
              pagination: false,
            }}
          >
            {members.map((member, index) => (
              <SplideSlide key={index}>
                <div className="mx-2">
                  <div className="w-40 h-40 relative">
                    <Image
                      loader={() =>
                        `${process.env.NEXT_PUBLIC_AVATAR_URL}/${member.avatar}`
                      }
                      src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${member.avatar}`}
                      alt=""
                      width={56}
                      height={56}
                      className="object-cover rounded-full"
                      unoptimized={true}
                    />
                    <div className="absolute top-0 left-0 right-0 bottom-0">
                      <div className="bg-gradient-to-b from-transparent to-black w-full h-full flex flex-col justify-end rounded-lg">
                        <div className="p-3 text-center">
                          <div className="text-white">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-white text-xs font-semibold">
                            {member.position}
                          </div>
                          <div className="text-white text-xs">
                            {member.company?.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </Card>
      </div>
    </div>
  );
};

export default CompanyPage;
