import { FC } from "react";
import ProfileCard from "./ProfileCard";
import BankCard from "./BankCard";
import FeaturedProfessionals from "./FeaturedProfessionals";
import AddPost from "./AddPost";
import PostsList from "./PostsList";
import InviteFriends from "./InviteFriends";
import WatchList from "./WatchList";

const HomePage: FC = () => {
  return (
    <>
      <div className="flex flex-row px-2 mt-10">
        <div className="w-80 hidden lg:block flex-shrink-0 mx-4">
          <div>
            <ProfileCard />
          </div>
          <div className="mt-12">
            <BankCard />
          </div>
        </div>
        <div className="min-w-0 mx-4">
          <FeaturedProfessionals />
          <div className="mt-10">
            <AddPost />
          </div>
          <div className="mt-5">
            <PostsList />
          </div>
        </div>
        <div className="w-80 hidden lg:block flex-shrink-0 mx-4">
          <InviteFriends />
          <div className="mt-6">
            <WatchList />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
