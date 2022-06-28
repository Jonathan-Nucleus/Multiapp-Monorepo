import { FC } from "react";
import { UserCircleMinus, UserCirclePlus } from "phosphor-react";
import { useFollowUser } from "shared/graphql/mutation/account/useFollowUser";
import { PostSummary } from "shared/graphql/fragments/post";
import { toast } from "desktop/app/components/common/Toast";

interface FollowUserMenuProps {
  user: Exclude<PostSummary["user"], undefined>;
}

const FollowUserMenu: FC<FollowUserMenuProps> = ({ user }) => {
  const { isFollowing, toggleFollow } = useFollowUser(user._id);
  return (
    <div
      className="flex items-center px-4 py-3 cursor-pointer hover:bg-background-blue"
      onClick={() => {
        toggleFollow().then(() => {
          if (!isFollowing) {
            toast.success(
              `You're following ${user.firstName} ${user.lastName}`
            );
          }
        });
      }}
    >
      {isFollowing ? (
        <UserCircleMinus fill="currentColor" weight="light" size={24} />
      ) : (
        <UserCirclePlus fill="currentColor" weight="light" size={24} />
      )}
      {isFollowing ? (
        <div className="ml-4">
          Unfollow {user.firstName} {user.lastName}
        </div>
      ) : (
        <div className="ml-4">
          Follow {user.firstName} {user.lastName}
        </div>
      )}
    </div>
  );
};

export default FollowUserMenu;
