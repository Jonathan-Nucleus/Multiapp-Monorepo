import { FC } from "react";
import Link from "next/link";

import Avatar from "desktop/app/components/common/Avatar";
import Button from "desktop/app/components/common/Button";
import Card from "desktop/app/components/common/Card";

import { useAccount } from "mobile/src/graphql/query/account";
import { useFollowUser } from "mobile/src/graphql/mutation/account";
import type { FundManager } from "mobile/src/graphql/query/marketplace/useFundManagers";

interface FeaturedManagerProps {
  manager: FundManager;
}

const FeaturedManager: FC<FeaturedManagerProps> = ({ manager }) => {
  const { data: userData } = useAccount({ fetchPolicy: "cache-only" });
  const [followUser] = useFollowUser();

  const isFollowing =
    userData?.account?.followingIds?.includes(manager._id) ?? false;

  const toggleFollowUser = async (): Promise<void> => {
    try {
      const { data } = await followUser({
        variables: { follow: !isFollowing, userId: manager._id },
        refetchQueries: ["Account"],
      });

      if (!data?.followUser) {
        console.log("err", data);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className="mx-2">
      <div className="w-40 h-40 relative">
        <Avatar src={manager.avatar} size={160} shape="square" />
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <div className="bg-gradient-to-b from-transparent to-black w-full h-full flex flex-col justify-end rounded-lg">
            <div className="p-3">
              <div className="text-white">{`${manager.firstName} ${manager.lastName}`}</div>
              <div className="text-white text-xs font-semibold">
                {manager.position}
              </div>
              <div className="text-white text-xs">{manager.company.name}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-2">
        <Button
          variant="text"
          className="text-xs text-primary font-normal uppercase"
          onClick={toggleFollowUser}
        >
          {isFollowing ? "unfollow" : "follow"}
        </Button>
      </div>
    </div>
  );
};

export default FeaturedManager;
