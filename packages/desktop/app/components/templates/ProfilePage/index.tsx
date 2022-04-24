import { FC } from "react";
import ProfileCard from "./ProfileCard";
import CompaniesList from "./CompaniesList";
import PostsList from "../../common/PostsList";
import FundCard from "../../modules/funds/FundCard";
import { UserProfile } from "mobile/src/graphql/query/user/useProfile";
import { usePosts } from "mobile/src/graphql/query/user/usePosts";
import { useManagedFunds } from "mobile/src/graphql/query/user/useManagedFunds";

interface ProfilePageProps {
  user: UserProfile;
}

const ProfilePage: FC<ProfilePageProps> = ({ user }) => {
  const { data: postData } = usePosts(user._id);
  const { data: fundsData } = useManagedFunds(user._id);

  const companies = user?.companies;
  const funds = fundsData?.userProfile?.managedFunds;
  const posts = postData?.userProfile?.posts;

  return (
    <>
      <div className="lg:mt-12 mb-12 lg:px-14">
        <div className="lg:grid grid-cols-6 gap-8">
          <div className="col-span-4">
            <div className="divide-y divide-inherit border-white/[.12]">
              <div className="pb-5">
                <ProfileCard user={user} />
              </div>
              <div className="lg:hidden mb-5 pt-5">
                <CompaniesList companies={user.companies} />
              </div>
              {funds && funds.length > 0 && (
                <div className="py-5">
                  {funds.map((fund) => (
                    <div key={fund._id} className="mb-5">
                      <FundCard fund={fund} showImages={false} />
                    </div>
                  ))}
                </div>
              )}
              {posts && posts.length > 0 && (
                <div className="py-5">
                  <PostsList posts={posts} />
                </div>
              )}
            </div>
          </div>
          <div className="col-span-2 hidden lg:block">
            {companies && <CompaniesList companies={companies} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
