import { FC } from "react";
import Link from "next/link";
import { Lock } from "phosphor-react";

import Button from "../../../../../common/Button";
import Card from "../../../../../common/Card";
import { ShieldCheck } from "phosphor-react";
import Avatar from "../../../../../common/Avatar";

import { useAccount } from "mobile/src/graphql/query/account";
import { useFollowUser } from "mobile/src/graphql/mutation/account";
import type {
  FundManager,
  FundListItem,
} from "mobile/src/graphql/query/marketplace/useFundManagers";

type Fund = FundListItem;

interface ManagerItemProps {
  manager: FundManager;
  funds: Fund[];
}

const ManagerItem: FC<ManagerItemProps> = ({
  manager,
  funds,
}: ManagerItemProps) => {
  const { data: { account } = {} } = useAccount({ fetchPolicy: "cache-only" });
  const [followUser] = useFollowUser();
  const isMyProfile = account?._id == manager?._id;
  const isFollowing = account?.followingIds?.includes(manager._id) ?? false;
  const toggleFollowUser = async () => {
    try {
      await followUser({
        variables: { follow: !isFollowing, userId: manager._id },
        refetchQueries: ["Account"],
      });
    } catch (err) {
    }
  };

  return (
    <>
      <div className="hidden lg:grid grid-cols-4 py-4">
        <div className="flex items-center">
          <Avatar
            size={56}
            src={manager.avatar}
            className="rounded-full overflow-hidden"
          />
          <div className="ml-3">
            <div className="text-sm text-white">
              {manager.firstName} {manager.lastName}
            </div>
            <div className="text-sm text-white opacity-60">
              {manager.position}
            </div>
          </div>
        </div>
        <div className="flex items-center px-1">
          <Avatar
            size={56}
            src={manager.company.avatar}
            className="rounded-full overflow-hidden"
          />
          <div className="ml-3">
            <div className="text-sm text-white">{manager.company.name}</div>
          </div>
        </div>
        <div className="flex items-center px-1">
          {funds.length === 0 ? (
            <div className="ml-2">
              <Lock size={24} />
            </div>
          ) : (
            funds.map((fund) => (
              <div key={fund._id} className="text-sm text-white">
                {fund.name}
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-end">
          {!isMyProfile &&
            <Button
              variant="text"
              className="text-sm text-primary font-medium tracking-normal py-0"
              onClick={toggleFollowUser}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          }
          <Link href={isMyProfile ? "/profile/me" : `/profile/${manager._id}`}>
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
      </div>
      <Card className="block lg:hidden border-0 rounded-none bg-primary-solid/[.07] px-5 py-3">
        <div className="flex items-center">
          <Avatar
            size={56}
            src={manager.avatar}
            className="bg-white rounded-full overflow-hidden"
          />
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
            {!isMyProfile &&
              <Button
                variant="outline-primary"
                className="text-sm text-white tracking-normal font-medium"
                onClick={toggleFollowUser}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            }
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="text-white font-medium">
            {manager.firstName} {manager.lastName}
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
        <div className="text-xs text-primary">{manager.company.name}</div>
        <div className="border-t border-white/[.12] mt-4">
          <div className="text-sm text-white font-medium mt-4">
            FUNDS MANAGED
          </div>
          <div className="text-sm text-primary mt-2">
            {manager.company.name} Fund
          </div>
        </div>
      </Card>
    </>
  );
};

export default ManagerItem;
