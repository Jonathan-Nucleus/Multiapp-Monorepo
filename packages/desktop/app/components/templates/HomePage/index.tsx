import { FC } from "react";
import CompanyCard from "./CompanyCard";
import FeaturedProfessionals from "./FeaturedProfessionals";
import InviteFriends from "../../modules/users/InviteFriends";
import ProfileCardSmall from "../../modules/users/ProfileCardSmall";
import Watchlist from "./Watchlist";
import PostsSection from "./PostsSection";
import { useCachedAccount } from "mobile/src/graphql/query/account/useAccount";

const HomePage: FC = () => {
  const account = useCachedAccount();
  return (
    <>
      <div className="flex flex-row mt-5 lg:mt-20 px-2">
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
            <Watchlist user={account} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
