import { FC, useState } from "react";
import Card from "../../../common/Card";
import Button from "../../../common/Button";
import Image from "next/image";
import { Star } from "phosphor-react";
import type { Fund } from "backend/graphql/funds.graphql";
import { useWatchFund } from "desktop/app/graphql/mutations/account";
import { useAccount } from "desktop/app/graphql/queries";

const WatchList: FC = () => {
  const [watchFund] = useWatchFund();
  const { data: accountData, loading: accountLoading, refetch } = useAccount();
  const watchList: Fund[] = accountData?.account.watchlist ?? [];

  const handleRemoveWahchList = async (id: string): Promise<void> => {
    try {
      const { data } = await watchFund({
        variables: { watch: false, fundId: id },
      });
      if (data?.watchFund) {
        refetch();
      } else {
        console.log("err", data);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <Card className="p-0 border-white/[.12] divide-y divide-inherit">
      <div className="text-white  p-4">Watch List</div>
      {watchList.map((item, index) => (
        <div key={item._id} className="flex items-center p-4">
          <div className="flex-shrink-0">
            <Image
              loader={() =>
                `${process.env.NEXT_PUBLIC_AVATAR_URL}/${item.avatar}`
              }
              src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${item.avatar}`}
              alt=""
              width={48}
              height={48}
              className="bg-white object-cover rounded"
              unoptimized={true}
            />
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
              onClick={() => handleRemoveWahchList(item._id)}
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
