import { FC, useState } from "react";
import CompanyCard from "./CompanyCard";
import FeaturedProfessionals from "./FeaturedProfessionals";
import InviteFriends from "desktop/app/components/modules/users/InviteFriends";
import ProfileCardSmall from "./ProfileCardSmall";
import DisclosureCard from "desktop/app/components/modules/funds/DisclosureCard";
import Watchlist from "desktop/app/components/modules/funds/Watchlist";
import PostsSection from "./PostsSection";
import Card from "desktop/app/components/common/Card";
import { useAccountContext } from "shared/context/Account";
import Tutorials from "./Tutorials";

const HomePage: FC = () => {
  const account = useAccountContext();
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="mt-5 lg:mt-10">
      <div className="flex flex-row mt-5 lg:mt-10">
        <div className="w-80 hidden lg:block flex-shrink-0">
          <ProfileCardSmall user={account} />
          <div className="mt-12">
            <CompanyCard user={account} />
          </div>
        </div>
        <div className="min-w-0 flex-grow lg:mx-4">
          <div className="px-4">
            <FeaturedProfessionals />
            <PostsSection
              account={account}
              onPostsLoaded={() => setShowTutorial(true)}
            />
          </div>
        </div>
        <div className="w-[350px] hidden lg:block flex-shrink-0">
          <InviteFriends />
          {(!account || account.watchlist.length > 0) && (
            <div className="mt-5">
              <Card className="p-0">
                <Watchlist />
              </Card>
            </div>
          )}
          <DisclosureCard className="mt-5" title="Prometheus Disclosures" />
        </div>
      </div>
      <Tutorials show={showTutorial} />
    </div>
  );
};

export default HomePage;
