import { FC } from "react";

import Avatar from "desktop/app/components/common/Avatar";
import Button from "desktop/app/components/common/Button";

import { useAccount } from "shared/graphql/query/account/useAccount";
import { useFollowUser } from "shared/graphql/mutation/account";
import type { FundManager } from "shared/graphql/query/marketplace/useFundManagers";
import Link from "next/link";

interface FeaturedManagerProps {
  manager: FundManager;
}

const FeaturedManager: FC<FeaturedManagerProps> = ({ manager }) => {
  const { data: { account } = {} } = useAccount({ fetchPolicy: "cache-only" });
  const [followUser] = useFollowUser();
  const isMyProfile = account?._id == manager._id;
  const isFollowing = account?.followingIds?.includes(manager._id) ?? false;
  const toggleFollowUser = async (): Promise<void> => {
    try {
      await followUser({
        variables: { follow: !isFollowing, userId: manager._id },
        refetchQueries: ["Account"],
      });
    } catch (err) {}
  };

  return (
    <div className="mx-2">
      <Link href={`/profile/${manager._id}`}>
        <a>
          <div className="relative">
            <Avatar user={manager} size={160} shape="square" />
            <div className="absolute top-0 left-0 right-0 bottom-0">
              <div className="bg-gradient-to-b from-transparent to-black w-full h-full flex flex-col justify-end rounded-lg">
                <div className="p-3">
                  <div className="text-white">
                    {`${manager.firstName} ${manager.lastName}`}
                  </div>
                  <div className="text-white text-xs font-semibold">
                    {manager.position}
                  </div>
                  <div className="text-white text-xs">
                    {manager.company.name.charAt(0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
      <div className="text-center mt-1.5">
        {!isMyProfile && (
          <Button
            variant="text"
            className="text-xs text-primary font-normal tracking-normal py-0"
            onClick={toggleFollowUser}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FeaturedManager;
