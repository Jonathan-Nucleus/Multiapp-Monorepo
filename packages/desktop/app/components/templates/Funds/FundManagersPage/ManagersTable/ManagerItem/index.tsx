import { FC } from "react";
import Link from "next/link";
import { Lock } from "phosphor-react";

import Button from "../../../../../common/Button";
import Card from "../../../../../common/Card";
import { ShieldCheck } from "phosphor-react";
import Avatar from "../../../../../common/Avatar";

import { useFollowUser } from "shared/graphql/mutation/account/useFollowUser";
import type {
  FundManager,
  FundListItem,
} from "shared/graphql/query/marketplace/useFundManagers";
import { useAccountContext } from "shared/context/Account";

interface ManagerItemProps {
  manager: FundManager;
  funds: FundListItem[];
}

const ManagerItem: FC<ManagerItemProps> = ({
  manager,
  funds,
}: ManagerItemProps) => {
  const account = useAccountContext();
  const { isFollowing: isFollowingManager, toggleFollow: toggleFollowManager } =
    useFollowUser(manager._id);
  const isMyProfile = account._id == manager._id;

  return (
    <>
      <tr className="hidden lg:table-row">
        <td className="border-t border-white/[.12] py-4">
          <div className="flex items-center">
            <Link href={`/profile/${isMyProfile ? "me" : manager._id}`}>
              <a>
                <Avatar user={manager} size={56} />
              </a>
            </Link>
            <div className="ml-3">
              <div className="text-sm text-white">
                <Link href={`/profile/${isMyProfile ? "me" : manager._id}`}>
                  <a>
                    {manager.firstName} {manager.lastName}
                  </a>
                </Link>
              </div>
              <div className="text-sm text-white opacity-60">
                {manager.position}
              </div>
            </div>
          </div>
        </td>
        <td className="border-t border-white/[.12] py-4">
          <div className="flex items-center px-1">
            <Link href={`/company/${manager.company._id}`}>
              <a>
                <div className="flex items-center">
                  <Avatar user={manager.company} size={56} shape="square" />
                  <div className="ml-3">
                    <div className="text-sm text-white">
                      {manager.company.name}
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        </td>
        <td className="border-t border-white/[.12] py-4">
          <div className="flex items-center px-1">
            {funds.length == 0 ? (
              <div className="ml-2">
                <Lock size={24} />
              </div>
            ) : (
              <div>
                {funds.map((fund) => (
                  <div key={fund._id} className="text-sm text-white">
                    {fund.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </td>
        <td className="border-t border-white/[.12] py-4">
          <div className="flex items-center justify-end">
            {!isMyProfile && !isFollowingManager && (
              <Button
                variant="text"
                className="text-sm text-primary font-medium tracking-normal py-0"
                onClick={toggleFollowManager}
              >
                {isFollowingManager ? "Unfollow" : "Follow"}
              </Button>
            )}
            <Link
              href={isMyProfile ? "/profile/me" : `/profile/${manager._id}`}
            >
              <a>
                <Button
                  variant="outline-primary"
                  className="text-sm text-white tracking-normal ml-4"
                >
                  View Profile
                </Button>
              </a>
            </Link>
          </div>
        </td>
      </tr>
      <tr className="table-row lg:hidden">
        <td colSpan={4}>
          <Card className="border-0 rounded-none bg-primary-solid/[.07] shadow-none mb-2 px-5 py-3">
            <div className="flex items-center">
              <Link href={`/profile/${isMyProfile ? "me" : manager._id}`}>
                <a>
                  <Avatar user={manager} size={56} />
                </a>
              </Link>
              <div className="w-14 ml-4">
                <div className="text-sm text-white font-medium">
                  {manager.postIds?.length ?? 0}
                </div>
                <div className="text-xs text-white">Posts</div>
              </div>
              <div className="w-14 ml-4">
                <div className="text-sm text-white font-medium">
                  {manager.followerIds?.length ?? 0}
                </div>
                <div className="text-xs text-white">Followers</div>
              </div>
              <div className="ml-auto">
                {!isMyProfile && !isFollowingManager && (
                  <Button
                    variant="outline-primary"
                    className="text-sm text-white tracking-normal font-medium"
                    onClick={toggleFollowManager}
                  >
                    {isFollowingManager ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="text-white font-medium">
                <Link href={`/profile/${isMyProfile ? "me" : manager._id}`}>
                  <a>
                    {manager.firstName} {manager.lastName}
                  </a>
                </Link>
              </div>
              {manager.role !== "USER" && (
                <>
                  <div className="text-success ml-3">
                    <ShieldCheck color="currentColor" weight="fill" size={16} />
                  </div>
                  <div className="text-xs text-white ml-1">{manager.role}</div>
                </>
              )}
            </div>
            <div className="text-xs text-white mt-1">{manager.position}</div>
            <div className="text-xs text-primary">
              <Link href={`/company/${manager.company._id}`}>
                <a>{manager.company.name}</a>
              </Link>
            </div>
            <div className="border-t border-white/[.12] mt-4">
              <div className="text-tiny text-white font-medium mt-4">
                {funds.filter((fund) => fund.limitedView).length > 0
                  ? "Strategies Managed"
                  : "Funds Managed"}
              </div>
              <div className="text-sm text-primary mt-2">
                {funds.map((fund) => (
                  <div key={fund._id}>{fund.name}</div>
                ))}
              </div>
            </div>
          </Card>
        </td>
      </tr>
    </>
  );
};

export default ManagerItem;
