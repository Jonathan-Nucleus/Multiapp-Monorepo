import React, { ChangeEvent, FC, useMemo, useState } from "react";
import { Dialog, Tab } from "@headlessui/react";
import { X } from "phosphor-react";
import Card from "desktop/app/components/common/Card";
import Button from "desktop/app/components/common/Button";
import Input from "desktop/app/components/common/Input";
import UserItem from "../UserItem";
import { UserProfile } from "backend/graphql/users.graphql";

interface FollowersModalProps {
  show: boolean;
  onClose: () => void;
  followers: UserProfile[];
  following: UserProfile[];
}

const FollowersModal: FC<FollowersModalProps> = ({
  show,
  onClose,
  followers,
  following,
}: FollowersModalProps) => {
  const [keywordFollowers, setKeywordFollowers] = useState("");
  const [keywordFollowing, setKeywordFollowing] = useState("");
  const filteredFollowers = useMemo(() => {
    if (keywordFollowers.trim().length == 0) {
      return followers;
    } else {
      return followers.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(keywordFollowers.toLowerCase())
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
          .includes(keywordFollowing.toLowerCase())
      );
    }
  }, [following, keywordFollowing]);
  return (
    <>
      <Dialog open={show} onClose={onClose} className="fixed z-10 inset-0">
        <div className="flex items-center justify-center h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Card className="flex flex-col border-0 h-3/4 mx-auto p-0 z-10 w-full max-w-md">
            <Tab.Group>
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
                        FOLLOWERS
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
                        FOLLOWING
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
                          <div key={user._id}>
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
                          <div key={user._id}>
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
          </Card>
        </div>
      </Dialog>
    </>
  );
};

export default FollowersModal;
