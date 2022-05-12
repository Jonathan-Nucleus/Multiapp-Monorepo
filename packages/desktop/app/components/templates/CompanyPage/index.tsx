import { FC } from "react";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";

import PostsList from "../../modules/posts/PostsList";
import Card from "../../common/Card";
import Avatar from "../../common/Avatar";
import ProfileCard from "./ProfileCard";
import TeamMembersList from "../../modules/teams/TeamMembersList";
import FundCard from "../../modules/funds/FundCard";
import { CompanyProfile } from "shared/graphql/query/company/useCompany";
import { useAccount } from "shared/graphql/query/account/useAccount";

interface CompanyPageProps {
  company: CompanyProfile;
}

const CompanyPage: FC<CompanyPageProps> = ({ company }: CompanyPageProps) => {
  const funds = company.funds.map((fund) => ({ ...fund, company }));
  const members = company.members.map((member) => ({ ...member, company }));
  const { data: { account } = {} } = useAccount({ fetchPolicy: "cache-only" });
  const isMyCompany =
    (account?.companies.findIndex((item) => item._id == company._id) ?? -1) !=
    -1;

  return (
    <div className="lg:mt-12 mb-12 lg:px-14">
      <div className="lg:grid grid-cols-6 gap-8">
        <div className="col-span-4">
          <div className="pb-5">
            <ProfileCard company={company} isEditable={isMyCompany} />
          </div>
          <div className="py-5">
            <div className="text-white mt-8 mb-2 ml-2 font-medium">Funds</div>
            {funds.map((fund) => (
              <div key={fund._id} className="mb-5">
                <FundCard fund={fund} showImages={false} />
              </div>
            ))}
          </div>
          <div className="w-full block lg:hidden">
            <div className="font-medium text-white ml-4 md:m-0">
              Team Members
            </div>
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
                        <Avatar user={member} size={56} shape="circle" />
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
                                {company?.name}
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
          {company.posts && (
            <div className="py-5">
              <PostsList
                posts={company.posts}
                onSelectPost={() => {}}
                onRefresh={() => {}}
              />
            </div>
          )}
        </div>
        <div className="col-span-2 hidden lg:block">
          <TeamMembersList members={members} showChat={true} />
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
