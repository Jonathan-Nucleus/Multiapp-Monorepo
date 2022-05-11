import { FC } from "react";
import Link from "next/link";
import Avatar from "../../Avatar";
import moment from "moment";
import { ShieldCheck } from "phosphor-react";
import Button from "../../Button";
import { PostSummary } from "mobile/src/graphql/fragments/post";
import { UserProfile } from "backend/graphql/users.graphql";

interface HeaderProps {
  post: PostSummary;
  account: Pick<UserProfile, "_id"> | undefined;
  isMyPost: boolean;
  isFollowing: boolean;
  toggleFollowing: () => void;
}

const Header: FC<HeaderProps> = ({
  post: {user, company, createdAt},
  account,
  isMyPost,
  isFollowing,
  toggleFollowing,
}: HeaderProps) => {
  return (
    <>
      {company ?
        <div className="flex items-center">
          <div>
            <Link href={`/company/${company._id}`}>
              <a>
                <Avatar size={56} user={company} />
              </a>
            </Link>
          </div>
          <div className="ml-2">
            <div className="flex items-center">
              <div>
                <Link href={`/company/${company._id}`}>
                  <a className="text-white capitalize">
                    {company.name}
                  </a>
                </Link>
                <div className="text-xs text-white opacity-60">
                  {moment(createdAt).format("MMM DD")}
                </div>
              </div>
            </div>
          </div>
        </div>
        :
        <div className="flex items-center">
          <div>
            <Link href={`/profile/${user?._id == account?._id ? "me" : user?._id}`}>
              <a>
                <Avatar size={56} user={user} />
              </a>
            </Link>
          </div>
          <div className="ml-2">
            <div className="flex items-center">
              <Link href={`/profile/${user?._id == account?._id ? "me" : user?._id}`}>
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
              {!isMyPost && !isFollowing && (
                <div className="flex items-center">
                  <div className="mx-1 text-white opacity-60">•</div>
                  <div className="flex">
                    <Button
                      variant="text"
                      className="text-tiny text-primary tracking-wider font-medium py-0"
                      onClick={() => toggleFollowing()}
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
              {moment(createdAt).format("MMM DD")}
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Header;
