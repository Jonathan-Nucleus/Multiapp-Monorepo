import { FC } from "react";
import Link from "next/link";
import { ShieldCheck, Star } from "phosphor-react";

import Avatar from "../../../../../common/Avatar";
import Button from "../../../../../common/Button";

import { PostSummary } from "shared/graphql/fragments/post";
import { useFollowUser } from "shared/graphql/mutation/account/useFollowUser";

interface UserHeaderProps {
  user: Exclude<PostSummary["user"], undefined>;
  accountId: string | undefined;
  createdAt: string;
  highlighted?: boolean;
}

const UserHeader: FC<UserHeaderProps> = ({
  user,
  accountId,
  createdAt,
  highlighted = false,
}) => {
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
            <Link
              href={`/profile/${user?._id == accountId ? "me" : user?._id}`}
            >
              <a className="text-white capitalize">
                {`${user?.firstName} ${user?.lastName}`}
              </a>
            </Link>
            {(user?.role === "VERIFIED" || user?.role === "PROFESSIONAL") && (
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
            {(user?.role === "FA" ||
              user?.role === "FO" ||
              user?.role === "IA" ||
              user?.role === "RIA") && (
              <>
                <ShieldCheck
                  className="text-primary-solid ml-1.5"
                  color="currentColor"
                  weight="fill"
                  size={16}
                />
                <div className="text-white text-tiny ml-1.5 text-tiny">
                  {user.role}
                </div>
              </>
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
          <div className="text-xs text-white/[0.6]">{user?.company?.name}</div>
          <div className="text-xs text-white/[0.6]">{user?.position}</div>
          <div className="flex flex-row items-center text-xs text-white/[0.6]">
            {highlighted ? (
              <div className="flex flex-row items-center text-white/[0.8] mr-1">
                <div className="text-primary-solid inline-block mr-1 mb-0.5">
                  <Star size={14} color="currentColor" weight="fill" />
                </div>{" "}
                <span>Featured Post</span>
                <span className="ml-1">•</span>
              </div>
            ) : (
              ""
            )}
            {createdAt}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserHeader;
