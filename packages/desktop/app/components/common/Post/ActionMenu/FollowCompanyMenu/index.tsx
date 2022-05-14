import { PostSummary } from "shared/graphql/fragments/post";
import { FC } from "react";
import { UserCircleMinus, UserCirclePlus } from "phosphor-react";
import {
  useFollowCompany,
} from "shared/graphql/mutation/account/useFollowCompany";

interface FollowCompanyMenuProps {
  company: Exclude<PostSummary["company"], undefined>;
}

const FollowCompanyMenu: FC<FollowCompanyMenuProps> = ({ company }) => {
  const { isFollowing, toggleFollow } = useFollowCompany(company._id);
  return (
    <div
      className="flex items-center px-4 py-3 cursor-pointer  hover:bg-background-blue"
      onClick={toggleFollow}
    >
      {isFollowing ?
        <UserCircleMinus
          fill="currentColor"
          weight="light"
          size={24}
        />
        :
        <UserCirclePlus
          fill="currentColor"
          weight="light"
          size={24}
        />
      }
      {isFollowing ?
        <div className="ml-4">
          Unfollow {company.name}
        </div>
        :
        <div className="ml-4">
          Follow {company.name}
        </div>
      }
    </div>
  );
};

export default FollowCompanyMenu;
