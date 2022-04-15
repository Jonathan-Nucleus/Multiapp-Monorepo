import React, { FC, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, Image as ImageIcon } from "phosphor-react";

import Member from "../TeamMembers/Member";
import Card from "../../../common/Card";
import Button from "../../../common/Button";
import Input from "../../../common/Input";
import type { User } from "backend/graphql/users.graphql";

interface SearchModalProps {
  show: boolean;
  onClose: () => void;
  members: User[];
}

const SearchModal: FC<SearchModalProps> = ({ show, onClose, members }) => {
  const [selelctedItem, setSelectedItem] = useState("follower");

  return (
    <>
      <Dialog open={show} onClose={onClose} className="fixed z-10 inset-0">
        <div className="flex items-center justify-center h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Card className="flex flex-col border-0 h-3/4 mx-auto p-0 z-10 w-full max-w-xl">
            <div className="flex items-center justify-between px-4 pt-2">
              <div className="flex items-center">
                <Button
                  variant="text"
                  onClick={() => setSelectedItem("follower")}
                  className={
                    selelctedItem === "follower"
                      ? `border-b border-primary`
                      : ""
                  }
                >
                  <div className="text-xl text-white font-medium">
                    Followers
                  </div>
                </Button>
                <Button
                  variant="text"
                  onClick={() => setSelectedItem("follow")}
                  className={
                    selelctedItem === "follow"
                      ? `border-b border-primary ml-8`
                      : "ml-8"
                  }
                >
                  <div className="text-xl text-white font-medium ">
                    Following
                  </div>
                </Button>
              </div>
              <Button variant="text">
                <X color="white" weight="bold" size={24} onClick={onClose} />
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border-y border-white/[.12]">
              <Input
                placeholder="Search team members..."
                className="rounded-full bg-background-DEFAULT"
              />
            </div>
            <div className="flex flex-col flex-grow  max-w-full md:min-h-0 p-4 overflow-y-auto">
              {members.map((member, index) => (
                <Member member={member} hiddenChat={true} key={index} />
              ))}
            </div>
          </Card>
        </div>
      </Dialog>
    </>
  );
};

export default SearchModal;
