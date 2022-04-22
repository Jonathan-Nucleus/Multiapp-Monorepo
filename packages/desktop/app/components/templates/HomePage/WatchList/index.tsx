import { FC } from "react";
import { Star } from "phosphor-react";
import Avatar from "../../../common/Avatar";
import Card from "../../../common/Card";
import Button from "../../../common/Button";
import { useWatchFund } from "mobile/src/graphql/mutation/funds";
import { useAccount } from "mobile/src/graphql/query/account";

const WatchList: FC = () => {
  const [watchFund] = useWatchFund();
  const { data: accountData } = useAccount();
  const watchList = accountData?.account?.watchlist ?? [];
  const handleRemoveWatchList = async (id: string) => {
    try {
      await watchFund({
        variables: { watch: false, fundId: id },
        refetchQueries: ["Account"],
      });
    } catch (err) {
    }
  };

  return (
    <Card className="p-0 border-white/[.12] divide-y divide-inherit">
      <div className="text-white  p-4">Watch List</div>
      {watchList.map((item) => (
        <div key={item._id} className="flex items-center p-4">
          <div className="flex-shrink-0">
            <Avatar src={item.company.avatar} size={48} shape="square" />
          </div>
          <div className="ml-3">
            <div className="text-white leading-4">{item.name}</div>
            <div className="text-xs text-white opacity-60">
              {item.company.name}
            </div>
          </div>
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
    </Card>
  );
};

export default WatchList;
