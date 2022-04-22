import { FC } from "react";
import PostsList from "../../common/PostsList";
import FundCard from "../../modules/funds/FundCard";
import { CompanyProfileProps } from "../../../types/common-props";
import ProfileCard from "./ProfileCard";
import TeamMembersList from "../../modules/teams/TeamMembersList";

const CompanyPage: FC<CompanyProfileProps> = ({ company }: CompanyProfileProps) => {
  const funds = company.funds.map(fund => ({ ...fund, company }));
  const members = company.members.map(member => ({ ...member, company }));
  return (
    <>
      <div className="lg:mt-12 mb-12 lg:px-14">
        <div className="lg:grid grid-cols-6 gap-8">
          <div className="col-span-4">
            <div className="divide-y divide-inherit border-white/[.12]">
              <div className="pb-5">
                <ProfileCard company={company} />
              </div>
              <div className="lg:hidden mb-5 pt-5 px-3">
                <TeamMembersList members={members} showChat={true} />
              </div>
              <div className="py-5">
                {funds.map((fund) => (
                  <div key={fund._id} className="mb-5">
                    <FundCard fund={fund} showImages={false} />
                  </div>
                ))}
              </div>
              <div className="py-5">
                <PostsList posts={company.posts} />
              </div>
            </div>
          </div>
          <div className="col-span-2 hidden lg:block">
            <TeamMembersList members={members} showChat={true} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyPage;
