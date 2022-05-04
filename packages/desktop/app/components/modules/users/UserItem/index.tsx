import { FC } from "react";
import Link from "next/link";
import { Chats } from "phosphor-react";

import Button from "desktop/app/components/common/Button";
import Avatar from "desktop/app/components/common/Avatar";
import { useAccount } from "mobile/src/graphql/query/account";
import { useFollowUser } from "mobile/src/graphql/mutation/account";

export type UserType = {
  _id: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  position?: string;
  company?: {
    name: string;
  };
};

export interface UserItemProps {
  user: UserType;
  showChat?: boolean;
}

const UserItem: FC<UserItemProps> = ({
  user,
  showChat = false,
}: UserItemProps) => {
  const { data: accountData } = useAccount();
  const [followUser] = useFollowUser();
  const isFollowing = accountData?.account?.followingIds?.includes(user._id);
  const isMyProfile = accountData?.account?._id == user._id;
  const toggleFollowing = async () => {
    try {
      await followUser({
        variables: { follow: !isFollowing, userId: user._id },
        refetchQueries: ["Account", "UserProfile", "CompanyProfile"],
      });
    } catch (error) {}
  };
  return (
    <div className="flex items-center">
      <Link href={`/profile/${user._id}`}>
        <a>
          <Avatar src={user.avatar} size={56} />
        </a>
      </Link>
      <div className="ml-2 flex-grow">
        <div className="flex items-center">
          <Link href={`/profile/${user._id}`}>
            <a className="text-white">
              {user.firstName} {user.lastName}
            </a>
          </Link>
          {!isMyProfile && (
            <>
              <div className="flex items-center">
                <div className="text-white opacity-60 mx-2">•</div>
                <Button
                  variant="text"
                  className="text-xs text-primary font-normal tracking-normal py-0"
                  onClick={toggleFollowing}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="text-xs text-white opacity-60">{user.position}</div>
        <div className="text-xs text-white opacity-60">
          {user.company?.name}
        </div>
      </div>
      {showChat && (
        <div className="ml-2">
          <Button variant="text" className="text-white">
            <Chats size={24} color="currentColor" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserItem;
