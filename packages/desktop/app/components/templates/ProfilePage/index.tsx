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
import CreatePostModal from "../HomePage/AddPost/CreatePostModal";
import Button from "../../common/Button";
import NoPostSvg from "shared/assets/images/no-post.svg";

interface ProfilePageProps {
  user: UserProfile;
  isEditable?: boolean;
}

const ProfilePage: FC<ProfilePageProps> = ({ user, isEditable = false }) => {
  const { data: postData } = usePosts(user._id);
  const { data: fundsData } = useManagedFunds(user._id);
  const { data: accountData } = useAccount();
  const [showPostModal, setShowPostModal] = useState(false);
  const isMyProfile = accountData?.account?._id == user._id;

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
                <ProfileCard user={user} isEditable={isEditable} />
              </div>
              <div className="lg:hidden mb-5 pt-5">
                <CompaniesList companies={user.companies} />
              </div>
              {funds && funds.length > 0 ? (
                <div className="py-5">
                  {funds.map((fund) => (
                    <div key={fund._id} className="mb-5">
                      <FundCard fund={fund} showImages={false} />
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
              {posts && posts.length > 0 ? (
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
                      <div className="text text-white">CREATE A POST</div>
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="col-span-2 hidden lg:block">
            {companies && <CompaniesList companies={companies} />}
          </div>
        </div>
      </div>
      <CreatePostModal
        show={showPostModal}
        onClose={() => setShowPostModal(false)}
      />
    </>
  );
};

export default ProfilePage;
