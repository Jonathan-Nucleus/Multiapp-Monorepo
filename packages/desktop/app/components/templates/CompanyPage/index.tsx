import { FC, useState } from "react";

import DisclosureCard from "desktop/app/components/modules/funds/DisclosureCard";
import FundCard from "../../modules/funds/FundCard";
import PostsList, { PostCategory } from "../../modules/posts/PostsList";
import ProfileCard from "./ProfileCard";
import TeamMembersList from "../../modules/teams/TeamMembersList";

import { CompanyProfile } from "shared/graphql/query/company/useCompany";
import { usePosts } from "shared/graphql/query/company/usePosts";
import { useAccountContext } from "shared/context/Account";

interface CompanyPageProps {
  company: CompanyProfile;
}

const CompanyPage: FC<CompanyPageProps> = ({ company }: CompanyPageProps) => {
  const [categories, setCategories] = useState<PostCategory[]>();
  const { data: { companyProfile: { posts = [] } = {} } = {} } = usePosts(
    company._id,
    categories
  );

  const funds = company.funds.map((fund) => ({ ...fund, company }));
  const members = company.members.map((member) => ({ ...member, company }));
  const account = useAccountContext();
  const isMyCompany = account.companyIds?.includes(company._id) ?? false;

  return (
    <div className="lg:mt-12 mb-12">
      <div className="lg:grid grid-cols-6 gap-8">
        <div className="col-span-4">
          <div className="pb-5">
            <ProfileCard company={company} isEditable={isMyCompany} />
          </div>
          {funds.length > 0 ? (
            <div className="py-5">
              <div className="text-white mt-8 mb-2 ml-2 font-medium">Funds</div>
              {funds.map((fund) => (
                <div key={fund._id} className="mb-5">
                  <FundCard fund={fund} showImages={false} />
                </div>
              ))}
            </div>
          ) : null}
          {!company.isChannel && (
            <div className="w-full block lg:hidden">
              <div className="mt-5">
                <TeamMembersList
                  direction="horizontal"
                  members={company.members}
                />
              </div>
            </div>
          )}
          {posts && (
            <div className="py-5">
              <PostsList
                posts={posts}
                initialFilter={{ categories, roleFilter: "EVERYONE" }}
                onFilterChange={({ categories: _categories }) =>
                  setCategories(_categories)
                }
              />
            </div>
          )}
        </div>
        <div className="col-span-2 hidden lg:block">
          {!company.isChannel && (
            <div className="mb-8">
              <TeamMembersList members={members} showChat={true} />
            </div>
          )}
          <DisclosureCard />
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
