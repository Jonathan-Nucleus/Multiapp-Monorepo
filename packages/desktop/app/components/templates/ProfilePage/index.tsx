import { FC, useState } from "react";
import { Plus } from "phosphor-react";
import Image from "next/image";

import ProfileCard from "./ProfileCard";
import CompaniesList from "./CompaniesList";
import PostsList from "../../common/PostsList";
import FundCard from "../../modules/funds/FundCard";
import { UserProfile } from "mobile/src/graphql/query/user/useProfile";
import { usePosts } from "mobile/src/graphql/query/user/usePosts";
import { useManagedFunds } from "mobile/src/graphql/query/user/useManagedFunds";
import { useAccount } from "mobile/src/graphql/query/account";
import Button from "../../common/Button";
import NoPostSvg from "shared/assets/images/no-post.svg";
import EditPostModal from "../../modules/posts/EditPostModal";

interface ProfilePageProps {
  user: UserProfile;
}

const ProfilePage: FC<ProfilePageProps> = ({ user }) => {
  const { data: postData } = usePosts(user._id);
  const { data: fundsData } = useManagedFunds(user._id);
  const { data: { account } = {} } = useAccount();
  const [showPostModal, setShowPostModal] = useState(false);
  const isMyProfile = account?._id == user._id;
  const funds = fundsData?.userProfile?.managedFunds ?? [];
  const posts = postData?.userProfile?.posts ?? [];

  return (
    <>
      <div className="lg:mt-12 mb-12 lg:px-14">
        <div className="flex justify-center mx-auto">
          <div className="max-w-4xl mx-4">
            <div className="divide-y divide-inherit border-white/[.12]">
              <div className="pb-5">
                <ProfileCard user={user} isEditable={isMyProfile} />
              </div>
              <div className="lg:hidden mb-5 pt-5">
                {user.companies.length > 0 && (
                  <CompaniesList companies={user.companies} />
                )}
              </div>
              {funds.length > 0 ? (
                <div className="py-5">
                  {funds.map((fund) => (
                    <div key={fund._id} className="mb-5">
                      <FundCard
                        fund={fund}
                        showImages={false}
                        profileType="manager"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                isMyProfile && (
                  <div className="text-sm text-white opacity-60 py-4">
                    You don’t have any featured posts, yet.
                  </div>
                )
              )}
              {posts.length > 0 ? (
                <div className="py-5">
                  <PostsList posts={posts} />
                </div>
              ) : (
                isMyProfile && (
                  <div className="text-center pt-4">
                    <Image src={NoPostSvg} alt="" />
                    <div className="text-white text-xl my-4">
                      You don’t have any posts, yet.
                    </div>
                    <Button
                      variant="gradient-primary"
                      className="w-52 h-12 rounded-full"
                      onClick={() => setShowPostModal(true)}
                    >
                      <Plus color="white" size={24} />
                      <div className="text text-white">Create a Post</div>
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
          {user.companies.length > 0 && (
            <div className="w-80 flex-shrink-0 hidden lg:block mx-4">
              <CompaniesList companies={user.companies} />
            </div>
          )}
        </div>
      </div>
      {showPostModal && (
        <EditPostModal
          show={showPostModal}
          onClose={() => setShowPostModal(false)}
        />
      )}
    </>
  );
};

export default ProfilePage;
