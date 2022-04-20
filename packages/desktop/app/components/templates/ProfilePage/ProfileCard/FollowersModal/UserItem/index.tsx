import { FC } from "react";
import Button from "../../../../../common/Button";
import { User } from "backend/graphql/users.graphql";
import Avatar from "../../../../../common/Avatar";
import { useAccount } from "../../../../../../graphql/queries";
import { useFollowUser } from "../../../../../../graphql/mutations/profiles";

interface UserItemProps {
  user: User;
}

const UserItem: FC<UserItemProps> = ({ user }) => {
  const { data: accountData } = useAccount();
  const [followUser] = useFollowUser();
  const isFollowing = accountData?.account?.followerIds?.includes(user._id);
  const toggleFollowing = async () => {
    try {
      await followUser({
        variables: { follow: !isFollowing, userId: user._id }
      });
    } catch (error) {
    }
  };
  return (
    <div className="flex items-center px-4 py-3">
      <Avatar src={user.avatar} size={56} />
      <div className="ml-2">
        <div className="flex items-center">
          <div className="text-white">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-white opacity-60 mx-2">•</div>
          <Button
            variant="text"
            className="text-xs text-primary font-normal tracking-normal py-0"
            onClick={toggleFollowing}
          >
            {isFollowing ? "UNFOLLOW" : "FOLLOW"}
          </Button>
        </div>
        <div className="text-xs text-white opacity-60">{user.position}</div>
        <div className="text-xs text-white opacity-60">
          {user.company?.name}
        </div>
      </div>
    </div>
  );
};

export default UserItem;
