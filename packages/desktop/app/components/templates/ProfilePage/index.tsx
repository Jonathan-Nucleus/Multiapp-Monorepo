import { FC, useState } from "react";
import ProfileCard from "./ProfileCard";
import CompaniesList from "./CompaniesList";
import EditPostModal from "../../modules/posts/EditPostModal";
import { UserProfileProps } from "../../../types/common-props";
import { useSession } from "next-auth/react";
import PostsSection from "./PostsSection";
import FundsSection from "./FundsSection";
import EditProfileModal from "./ProfileCard/EditModal";
import EditMediaModal from "./EditMediaModal";
import { MediaType } from "backend/graphql/mutations.graphql";

interface ProfilePageProps extends UserProfileProps {
  userId: string;
}

const ProfilePage: FC<ProfilePageProps> = ({ user, userId }) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditMedia, setShowEditMedia] = useState(false);
  const [mediaTypeToEdit, setMediaTypeToEdit] = useState<MediaType>();
  const { data: session } = useSession();
  const isMyProfile = session?.user?._id == userId;

  return (
    <>
      <div className="lg:mt-12 mb-12 lg:px-14">
        <div className="flex justify-center mx-auto">
          <div className="flex-grow max-w-full mx-4">
            <div className="divide-y divide-inherit border-white/[.12]">
              <div className="pb-5">
                <ProfileCard
                  user={user}
                  isEditable={isMyProfile}
                  onSelectToEditProfile={() => setShowEditProfile(true)}
                  onSelectToEditMedia={(mediaType) => {
                    setMediaTypeToEdit(mediaType);
                    setShowEditMedia(true);
                  }}
                />
              </div>
              <div className="lg:hidden mb-5 pt-5">
                <CompaniesList companies={user?.companies} />
              </div>
              <FundsSection userId={userId} showNoFundsLabel={isMyProfile} />
              <PostsSection userId={userId} showAddPost={isMyProfile} />
            </div>
          </div>
          <div className="w-80 flex-shrink-0 hidden lg:block mx-4">
            <CompaniesList companies={user?.companies} />
          </div>
        </div>
      </div>
      {showPostModal && (
        <EditPostModal
          show={showPostModal}
          onClose={() => setShowPostModal(false)}
        />
      )}
      {showEditProfile && (
        <EditProfileModal
          show={showEditProfile}
          onClose={() => setShowEditProfile(false)}
        />
      )}
      {showEditMedia && (
        <EditMediaModal
          type={mediaTypeToEdit!}
          user={user!}
          show={showEditMedia}
          onClose={() => setShowEditMedia(false)}
        />
      )}
    </>
  );
};

export default ProfilePage;
