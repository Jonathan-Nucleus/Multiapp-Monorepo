import { FC } from "react";

import Avatar from "desktop/app/components/common/Avatar";
import Button from "desktop/app/components/common/Button";

import { useAccount } from "mobile/src/graphql/query/account";
import { useFollowUser } from "mobile/src/graphql/mutation/account";
import type { FundManager } from "mobile/src/graphql/query/marketplace/useFundManagers";
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
    } catch (err) {
    }
  };

  return (
    <div className="mx-2">
      <Link href={`/profile/${manager._id}`}>
        <a>
          <div className="w-40 h-40 relative">
            <Avatar src={manager.avatar} size={160} shape="square" />
            <div className="absolute top-0 left-0 right-0 bottom-0">
              <div className="bg-gradient-to-b from-transparent to-black w-full h-full flex flex-col justify-end rounded-lg">
                <div className="p-3">
                  <div className="text-white">
                    {`${manager.firstName} ${manager.lastName}`}
                  </div>
                  <div className="text-white text-xs font-semibold">
                    {manager.position}
                  </div>
                  <div className="text-white text-xs">{manager.company.name}</div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
      <div className="text-center mt-1.5">
        {!isMyProfile &&
          <Button
            variant="text"
            className="text-xs text-primary font-normal tracking-normal py-0"
            onClick={toggleFollowUser}
          >
            {isFollowing ? "UNFOLLOW" : "FOLLOW"}
          </Button>
        }
      </div>
    </div>
  );
};

export default FeaturedManager;
