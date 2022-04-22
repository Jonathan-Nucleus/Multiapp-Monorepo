import { FC } from "react";
import ProfileCard from "./ProfileCard";
import CompaniesList from "./CompaniesList";
import PostsList from "../../common/PostsList";
import FundCard from "../../modules/funds/FundCard";
import { UserProfileProps } from "../../../types/common-props";

const ProfilePage: FC<UserProfileProps> = ({ user }: UserProfileProps) => {
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
              {user.managedFunds.length > 0 && (
                <div className="py-5">
                  {user.managedFunds.map((fund) => (
                    <div key={fund._id} className="mb-5">
                      <FundCard fund={fund} showImages={false} />
                    </div>
                  ))}
                </div>
              )}
              {user.posts.length > 0 && (
                <div className="py-5">
                  <PostsList posts={user.posts} />
                </div>
              )}
            </div>
          </div>
          <div className="col-span-2 hidden lg:block">
            <CompaniesList companies={user.companies} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
