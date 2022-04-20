import { FC } from "react";
import ProfileCard from "./ProfileCard";
import { AccountData, useFetchPosts } from "desktop/app/graphql/queries";
import CompaniesList from "./CompaniesList";
import PostsList from "../../common/PostsList";
import FundCard from "../../modules/funds/FundCard";
import { useFetchFunds } from "../../../graphql/queries/marketplace";

export interface ProfilePageProps {
  account: Exclude<AccountData["account"], undefined>;
}

const ProfilePage: FC<ProfilePageProps> = ({ account }: ProfilePageProps) => {
  const { data: fundsData } = useFetchFunds();
  const { data: postsData } = useFetchPosts();
  return (
    <>
      <div className="lg:mt-12 mb-12 lg:px-14">
        <div className="lg:grid grid-cols-6 gap-8">
          <div className="col-span-4">
            <div className="divide-y divide-inherit border-white/[.12]">
              <div className="pb-5">
                <ProfileCard account={account} />
              </div>
              <div className="lg:hidden mb-5 pt-5">
                <CompaniesList companies={account.companies} />
              </div>
              {fundsData?.funds && fundsData.funds.length > 0 && (
                <div className="py-5">
                  {fundsData.funds.map((fund) => (
                    <div key={fund._id} className="mb-5">
                      <FundCard fund={fund} showImages={false} />
                    </div>
                  ))}
                </div>
              )}
              {postsData?.posts && (
                <div className="py-5">
                  <PostsList posts={postsData.posts} />
                </div>
              )}
            </div>
          </div>
          <div className="col-span-2 hidden lg:block">
            <CompaniesList companies={account.companies} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
