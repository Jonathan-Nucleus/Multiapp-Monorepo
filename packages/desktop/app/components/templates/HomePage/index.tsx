import { FC, useState, useEffect } from "react";
import { Plus } from "phosphor-react";

import ProfileCard from "./ProfileCard";
import BankCard from "./BankCard";
import FeaturedProfessionals from "./FeaturedProfessionals";
import AddPost from "./AddPost";
import PostsList from "./PostsList";
import InviteFriends from "./InviteFriends";
import WatchList from "./WatchList";
import Button from "../../common/Button";
import CreatePostModal from "../CreatePostModal";

const HomePage: FC = () => {
  const [open, setOpen] = useState(false);

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
          <div className="mt-10 hidden md:block">
            <AddPost onClick={() => setOpen(true)} />
          </div>
          <div className="mt-5">
            <PostsList />
          </div>
        </div>
        <div className="w-80 flex-shrink-0 mx-4">
          <InviteFriends />
          <div className="mt-5">
            <WatchList />
          </div>
        </div>
        <div className="block md:hidden absolute bottom-5 right-5">
          <Button
            variant="gradient-primary"
            className="w-12 h-12 rounded-full"
            onClick={() => setOpen(true)}
          >
            <Plus color="white" size={24} />
          </Button>
        </div>
      </div>
      {open && <CreatePostModal setOpen={(val) => setOpen(val)} />}
    </>
  );
};

export default HomePage;
