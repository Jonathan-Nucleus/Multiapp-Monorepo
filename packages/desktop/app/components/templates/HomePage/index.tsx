import { FC, useState } from "react";
import CompanyCard from "./CompanyCard";
import FeaturedProfessionals from "./FeaturedProfessionals";
import InviteFriends from "../../modules/users/InviteFriends";
import ProfileCardSmall from "../../modules/users/ProfileCardSmall";
import Watchlist from "./Watchlist";
import PostsSection from "./PostsSection";
import { useCachedAccount } from "mobile/src/graphql/query/account/useAccount";
import { useWatchFund } from "mobile/src/graphql/mutation/funds/useWatchFund";
import Button from "../../common/Button";
import { useEffect } from "react";

interface WatchProps {
  id: string;
  name: string;
}

const HomePage: FC = () => {
  const account = useCachedAccount();
  const [watchFund] = useWatchFund();
  const [watchItem, setWatchItem] = useState<WatchProps | null>(null);

  useEffect(() => {
    if (!watchItem) return;
    const timer = setTimeout(() => setWatchItem(null), 5000);
    return () => clearTimeout(timer);
  }, [watchItem]);

  const handleToggleWatchList = async (id: string, watch: boolean) => {
    if (!id) {
      return;
    }
    try {
      await watchFund({
        variables: { watch: watch, fundId: id },
        refetchQueries: ["Account"],
      });
      if (watch) {
        setWatchItem(null);
      }
    } catch (err) {}
  };

  return (
    <div className="mt-5 lg:mt-10">
      {watchItem?.id && (
        <div className="flex flex-row justify-between items-center max-w-2xl m-auto rounded-lg bg-background-card p-4">
          <div className="text-white/[.87] text-sm">
            You removed{" "}
            <span className="text-white font-bold">{watchItem?.name}</span>
          </div>
          <Button
            variant="text"
            onClick={() => handleToggleWatchList(watchItem?.id, true)}
          >
            <div className="uppercase text-white">undo</div>
          </Button>
        </div>
      )}

      <div className="flex flex-row mt-5 lg:mt-10 px-2">
        <div className="w-80 hidden lg:block flex-shrink-0 mx-4">
          <ProfileCardSmall user={account} />
          <div className="mt-12">
            <CompanyCard user={account} />
          </div>
        </div>
        <div className="min-w-0 flex-grow">
          <div className="px-4">
            <FeaturedProfessionals />
            <PostsSection user={account} />
          </div>
        </div>
        <div className="w-80 hidden lg:block flex-shrink-0 mx-4">
          <InviteFriends />
          <div className="mt-5">
            <Watchlist
              user={account}
              setWatchItem={(val) => setWatchItem(val)}
              handleToggleWatchList={handleToggleWatchList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
