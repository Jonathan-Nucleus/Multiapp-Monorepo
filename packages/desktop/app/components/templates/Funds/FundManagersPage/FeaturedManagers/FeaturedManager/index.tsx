import { FC } from "react";

import Avatar from "desktop/app/components/common/Avatar";
import Button from "desktop/app/components/common/Button";

import { useFollowUser } from "shared/graphql/mutation/account/useFollowUser";
import { FundManager } from "shared/graphql/query/marketplace/useFundManagers";
import Link from "next/link";
import { useAccountContext } from "shared/context/Account";

interface FeaturedManagerProps {
  manager: FundManager;
}

const FeaturedManager: FC<FeaturedManagerProps> = ({ manager }) => {
  const account = useAccountContext();
  const { isFollowing: isFollowingManager, toggleFollow: toggleFollowManager } =
    useFollowUser(manager._id);
  const isMyProfile = account?._id == manager._id;

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
        <div className={!isMyProfile && !isFollowingManager ? "" : "invisible"}>
          <Button
            variant="text"
            className="text-xs text-primary font-normal tracking-normal py-0"
            onClick={toggleFollowManager}
          >
            {isFollowingManager ? "Unfollow" : "Follow"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedManager;
