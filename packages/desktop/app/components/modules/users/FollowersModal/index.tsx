import React, { ChangeEvent, FC, useMemo, useState } from "react";
import { Tab } from "@headlessui/react";
import { X } from "phosphor-react";

import Button from "desktop/app/components/common/Button";
import Input from "desktop/app/components/common/Input";
import UserItem from "../UserItem";
import { FollowUser } from "mobile/src/graphql/query/company";
import ModalDialog from "../../../common/ModalDialog";

interface FollowersModalProps {
  show: boolean;
  onClose: () => void;
  selectedTab?: number;
  followers: FollowUser[];
  following: FollowUser[];
}

const FollowersModal: FC<FollowersModalProps> = ({
  show,
  onClose,
  selectedTab,
  followers,
  following,
}: FollowersModalProps) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(selectedTab ?? 0);
  const [keywordFollowers, setKeywordFollowers] = useState("");
  const [keywordFollowing, setKeywordFollowing] = useState("");
  const filteredFollowers = useMemo(() => {
    if (keywordFollowers.trim().length == 0) {
      return followers;
    } else {
      return followers.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(keywordFollowers.toLowerCase()),
      );
    }
  }, [followers, keywordFollowers]);
  const filteredFollowing = useMemo(() => {
    if (keywordFollowing.length == 0) {
      return following;
    } else {
      return following.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(keywordFollowing.toLowerCase()),
      );
    }
  }, [following, keywordFollowing]);
  return (
    <>
      <ModalDialog
        show={show}
        onClose={onClose}
        className="flex flex-col border-0 h-[80vh] p-0 z-20 w-full max-w-md"
      >
        <Tab.Group
          selectedIndex={selectedTabIndex}
          onChange={setSelectedTabIndex}
        >
          <div className="flex items-center">
            <Tab.List>
              <Tab>
                {({ selected }) => (
                  <div
                    className={`text-sm ${
                      selected ? "text-primary" : "text-white opacity-60"
                    } font-medium tracking-widest border-b-2 ${
                      selected ? "border-primary" : "border-transparent"
                    } px-8 py-4`}
                  >
                    Followers
                  </div>
                )}
              </Tab>
              <Tab>
                {({ selected }) => (
                  <div
                    className={`text-sm ${
                      selected ? "text-primary" : "text-white opacity-60"
                    } font-medium tracking-widest border-b-2 ${
                      selected ? "border-primary" : "border-transparent"
                    } px-8 py-4`}
                  >
                    Following
                  </div>
                )}
              </Tab>
            </Tab.List>
            <Button
              variant="text"
              className="text-white opacity-60 ml-auto mr-4"
              onClick={onClose}
            >
              <X color="white" weight="bold" size={24} />
            </Button>
          </div>
          <Tab.Panels className="min-h-0">
            <Tab.Panel className="h-full flex flex-col">
              <div className="border-t-2 border-t-brand-overlay/[.1] border-b border-b-brand-overlay/[.1] -mt-0.5 p-4">
                <Input
                  placeholder="Search followers..."
                  className="text-xs !text-white bg-black !rounded-full !px-4 !py-3"
                  value={keywordFollowers}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setKeywordFollowers(event.target.value)
                  }
                />
              </div>
              <div className="min-h-0 py-4 overflow-y-auto">
                {filteredFollowers.length > 0 ? (
                  <>
                    {filteredFollowers.map((user) => (
                      <div key={user._id} className="px-3 py-3">
                        <UserItem user={user} />
                      </div>
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Tab.Panel>
            <Tab.Panel className="h-full flex flex-col">
              <div className="border-t-2 border-t-brand-overlay/[.1] border-b border-b-brand-overlay/[.1] -mt-0.5 p-4">
                <Input
                  placeholder="Search following..."
                  className="text-xs !text-white bg-black !rounded-full !px-4 !py-3"
                  value={keywordFollowing}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setKeywordFollowing(event.target.value)
                  }
                />
              </div>
              <div className="min-h-0 py-4 overflow-y-auto">
                {filteredFollowing.length > 0 ? (
                  <>
                    {filteredFollowing.map((user) => (
                      <div key={user._id} className="px-3 py-3">
                        <UserItem user={user} />
                      </div>
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </ModalDialog>
    </>
  );
};

export default FollowersModal;
