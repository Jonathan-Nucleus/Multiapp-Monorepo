import { FC } from "react";
import Link from "next/link";
import Avatar from "../../../../../common/Avatar";
import { ShieldCheck } from "phosphor-react";
import Button from "../../../../../common/Button";
import { PostSummary } from "shared/graphql/fragments/post";
import { useFollowUser } from "shared/graphql/mutation/account/useFollowUser";

interface UserHeaderProps {
  user: Exclude<PostSummary["user"], undefined>;
  accountId: string | undefined;
  createdAt: string;
}

const UserHeader: FC<UserHeaderProps> = ({ user, accountId, createdAt }) => {
  const isMyProfile = user._id == accountId;
  const { isFollowing, toggleFollow } = useFollowUser(user._id);

  return (
    <>
      <div className="flex items-center">
        <div>
          <Link href={`/profile/${user?._id == accountId ? "me" : user?._id}`}>
            <a>
              <Avatar size={56} user={user} />
            </a>
          </Link>
        </div>
        <div className="ml-2">
          <div className="flex items-center">
            <Link href={`/profile/${user?._id == accountId ? "me" : user?._id}`}>
              <a className="text-white capitalize">
                {`${user?.firstName} ${user?.lastName}`}
              </a>
            </Link>
            {(user?.role == "VERIFIED" || user?.role == "PROFESSIONAL") && (
              <ShieldCheck
                className="text-success ml-1.5"
                color="currentColor"
                weight="fill"
                size={16}
              />
            )}
            {user?.role == "PROFESSIONAL" && (
              <div className="text-white text-tiny ml-1.5 text-tiny">PRO</div>
            )}
            {!isMyProfile && !isFollowing && (
              <div className="flex items-center">
                <div className="mx-1 text-white opacity-60">•</div>
                <div className="flex">
                  <Button
                    variant="text"
                    className="text-tiny text-primary tracking-wider font-medium py-0"
                    onClick={toggleFollow}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="text-xs text-white opacity-60">
            {user?.position}
          </div>
          <div className="text-xs text-white opacity-60">
            {createdAt}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserHeader;
