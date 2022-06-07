import { FC } from "react";
import CompanyCard from "./CompanyCard";
import FeaturedProfessionals from "./FeaturedProfessionals";
import InviteFriends from "../../modules/users/InviteFriends";
import ProfileCardSmall from "../../modules/users/ProfileCardSmall";
import Watchlist from "../../modules/funds/Watchlist";
import PostsSection from "./PostsSection";
import Card from "../../common/Card";
import { useAccountContext } from "shared/context/Account";

const HomePage: FC = () => {
  const account = useAccountContext();

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
            <PostsSection user={account} />
          </div>
        </div>
        <div className="w-80 hidden lg:block flex-shrink-0">
          <InviteFriends />
          {(!account || account.watchlist.length > 0) && (
            <div className="mt-5">
              <Card className="p-0">
                <Watchlist user={account} />
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
