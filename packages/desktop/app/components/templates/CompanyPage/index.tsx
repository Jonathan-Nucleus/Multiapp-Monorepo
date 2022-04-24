import { FC } from "react";
import PostsList from "../../common/PostsList";
import FundCard from "../../modules/funds/FundCard";
import ProfileCard from "./ProfileCard";
import TeamMembersList from "../../modules/teams/TeamMembersList";
import { CompanyProfile } from "mobile/src/graphql/query/company/useCompany";
import { usePosts } from "mobile/src/graphql/query/company/usePosts";

interface CompanyPageProps {
  company: CompanyProfile;
}

const CompanyPage: FC<CompanyPageProps> = ({ company }) => {
  const { data: postsData } = usePosts(company._id);

  const posts = postsData?.companyProfile?.posts;
  const funds = company.funds.map((fund) => ({ ...fund, company }));
  const members = company.members.map((member) => ({ ...member, company }));

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
              <div className="py-5">{posts && <PostsList posts={posts} />}</div>
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
