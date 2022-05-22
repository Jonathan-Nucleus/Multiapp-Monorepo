import React, { FC } from "react";
import { Star, X } from "phosphor-react";
import Avatar from "../../../common/Avatar";
import Button from "../../../common/Button";
import Link from "next/link";
import Skeleton from "./Skeleton";
import { UserProfileProps } from "../../../../types/common-props";
import { useWatchFund } from "shared/graphql/mutation/funds/useWatchFund";

interface WatchlistProps extends UserProfileProps {
  onClose?: () => void;
}

const Watchlist: FC<WatchlistProps> = ({ user, onClose }) => {
  const [watchFund] = useWatchFund();
  const handleRemoveWatchList = async (id: string) => {
    try {
      await watchFund({
        variables: { watch: false, fundId: id },
        refetchQueries: ["Account"],
      });
    } catch (err) {
    }
  };
  if (!user) {
    return <Skeleton />;
  }
  return (
    <div className="border-white/[.12] divide-y divide-inherit">
      <div className="text-white flex items-center p-4">
        <div>Watch List</div>
        {onClose && (
          <div className="flex ml-auto">
            <Button
              variant="text"
              className="opacity-60 py-0"
              onClick={onClose}
            >
              <X color="currentColor" weight="bold" size={24} />
            </Button>
          </div>
        )}
      </div>
      {user.watchlist.map((item) => (
        <div
          key={item._id}
          className="flex items-center p-4 hover:bg-primary-overlay/[.24] transition-all"
        >
          <Link href={`/funds/${item._id}`}>
            <a>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Avatar user={item.company} size={48} shape="square" />
                </div>
                <div className="ml-3">
                  <div className="text-white leading-4">{item.name}</div>
                  <div className="text-xs text-white opacity-60">
                    {item.company.name}
                  </div>
                </div>
              </div>
            </a>
          </Link>
          <div className="ml-auto">
            <Button
              variant="text"
              className={"text-primary-medium"}
              onClick={() => handleRemoveWatchList(item._id)}
            >
              <Star color="currentColor" weight={"fill"} size={16} />
            </Button>
          </div>
        </div>
      ))}
      {user.watchlist.length == 0 &&
        <div className="text-xs text-gray-500 text-center p-4"></div>
      }
    </div>
  );
};

export default Watchlist;