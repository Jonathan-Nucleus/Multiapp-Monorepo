import { FC } from "react";
import { Star } from "phosphor-react";
import Avatar from "../../../common/Avatar";
import Card from "../../../common/Card";
import Button from "../../../common/Button";
import Link from "next/link";
import { UserProfile } from "shared/graphql/query/user/useProfile";
import Skeleton from "./Skeleton";

interface WatchProps {
  id: string;
  name: string;
}
interface WatchListProps {
  user: UserProfile | undefined;
  setWatchItem: (val: WatchProps) => void;
  handleToggleWatchList: (id: string, watch: boolean) => void;
}

const Watchlist: FC<WatchListProps> = ({
  user,
  setWatchItem,
  handleToggleWatchList,
}) => {
  if (!user) {
    return <Skeleton />;
  }
  if (user.watchlist.length == 0) {
    return <></>;
  }
  return (
    <Card className="p-0 border-white/[.12] divide-y divide-inherit">
      <div className="text-white  p-4">Watch List</div>
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
              onClick={() => {
                setWatchItem({
                  id: item._id,
                  name: item.name,
                });
                handleToggleWatchList(item._id, false);
              }}
            >
              <Star color="currentColor" weight={"fill"} size={16} />
            </Button>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default Watchlist;
