import { FC } from "react";
import Link from "next/link";
import { Chats } from "phosphor-react";

import Button from "desktop/app/components/common/Button";
import Avatar from "desktop/app/components/common/Avatar";
import { useFollowUser } from "shared/graphql/mutation/account/useFollowUser";
import { useAccountContext } from "shared/context/Account";

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
  showFollow?: boolean;
  showCompany?: boolean;
}

const UserItem: FC<UserItemProps> = ({
  user,
  showChat = false,
  showFollow = true,
  showCompany = true,
}: UserItemProps) => {
  const account = useAccountContext();
  const { isFollowing, toggleFollow } = useFollowUser(user._id);
  const isMyProfile = account._id == user._id;

  return (
    <div className="flex items-center">
      <Link href={`/profile/${isMyProfile ? "me" : user._id}`}>
        <a>
          <Avatar user={user} size={56} />
        </a>
      </Link>
      <div className="ml-2 flex-grow">
        <div className="flex items-center">
          <Link href={`/profile/${isMyProfile ? "me" : user._id}`}>
            <a className="text-white">
              {user.firstName} {user.lastName}
            </a>
          </Link>
          {!isMyProfile && !isFollowing && showFollow && (
            <>
              <div className="flex items-center">
                <div className="text-white opacity-60 mx-2">•</div>
                <Button
                  variant="text"
                  className="text-xs text-primary font-normal tracking-normal py-0"
                  onClick={toggleFollow}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </div>
            </>
          )}
        </div>
        {showCompany && (
          <div className="text-xs text-white opacity-60">{user.position}</div>
        )}
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
