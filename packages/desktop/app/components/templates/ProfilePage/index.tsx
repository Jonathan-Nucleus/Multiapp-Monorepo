import { FC, useState } from "react";
import ProfileCard from "./ProfileCard";
import CompaniesList from "./CompaniesList";
import CompaniesListSkeleton from "./CompaniesList/Skeleton";
import DisclosureCard from "desktop/app/components/modules/funds/DisclosureCard";
import { UserProfileProps } from "../../../types/common-props";
import PostsSection from "./PostsSection";
import FundsSection from "./FundsSection";
import EditProfileModal from "./ProfileCard/EditModal";
import ProfileCardSkeleton from "./ProfileCard/Skeleton";

interface ProfilePageProps extends UserProfileProps {
  loading: boolean;
  isMyProfile: boolean;
}

const ProfilePage: FC<ProfilePageProps> = ({ user, loading, isMyProfile }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);

  return (
    <>
      <div className="lg:mt-12 mb-12">
        <div className="flex justify-center mx-auto">
          <div className="flex-grow max-w-3xl lg:mx-4">
            <div className="divide-y divide-inherit border-white/[.12]">
              <div className="pb-5">
                {user ? (
                  <ProfileCard
                    user={user}
                    isEditable={isMyProfile}
                    onSelectToEditProfile={() => setShowEditProfile(true)}
                  />
                ) : (
                  <ProfileCardSkeleton />
                )}
              </div>
              {loading && (
                <div className="lg:hidden mb-5 pt-5">
                  <CompaniesListSkeleton />
                </div>
              )}
              {user?.companies && user.companies.length > 0 && (
                <div className="lg:hidden mb-5 pt-5">
                  <CompaniesList companies={user?.companies} />
                </div>
              )}
              {user && (
                <FundsSection
                  userId={user._id}
                  showNoFundsLabel={isMyProfile}
                />
              )}
              <div className="pt-4">
                {user && (
                  <PostsSection userId={user._id} showAddPost={isMyProfile} />
                )}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="hidden lg:block w-80">
              {loading && (
                <div className="mx-4">
                  <CompaniesListSkeleton />
                </div>
              )}
              {user?.companies && user.companies.length > 0 && (
                <div className="mx-4">
                  <CompaniesList companies={user?.companies} />
                </div>
              )}
              <DisclosureCard />
            </div>
          </div>
        </div>
      </div>
      {showEditProfile && (
        <EditProfileModal
          show={showEditProfile}
          onClose={() => setShowEditProfile(false)}
        />
      )}
    </>
  );
};

export default ProfilePage;
