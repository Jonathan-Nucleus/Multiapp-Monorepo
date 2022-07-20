import React, { FC, Fragment } from "react";
import { User } from "shared/context/Chat/types";
import { Transition } from "@headlessui/react";
import Card from "../../../../common/Card";
import Button from "../../../../common/Button";
import { X } from "phosphor-react";
import ChatAvatar from "../../ChatAvatar";

interface GroupChatInfoProps {
  users: User[];
  show: boolean;
  onClose: () => void;
}

const GroupChatInfo: FC<GroupChatInfoProps> = ({ users, show, onClose }) => {
  return (
    <>
      <Transition appear show={show}>
        <Transition.Child
          enter="transition-opacity ease-linear duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-70 z-20" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="fixed inset-0 overflow-auto z-20" onClick={onClose}>
            <Card
              className="w-96 max-w-full min-h-full rounded-none ml-auto p-0"
              onClick={(event) => event.preventDefault()}
            >
              <div className="flex items-center justify-between border-b border-white/[.12] px-6 py-8">
                <div className="text-2xl text-white">Group Chat Info</div>
                <Button variant="text" className="text-white" onClick={onClose}>
                  <X color="currentColor" size={24} weight={"bold"} />
                </Button>
              </div>
              <div className="py-4">
                {users.map((user, index) => (
                  <div
                    key={index}
                    className="hover:bg-primary-overlay/[.2] cursor-pointer rounded-lg transition-all mx-5"
                  >
                    <div className="flex items-center p-4">
                      <ChatAvatar size={48} user={user} />
                      <div className="flex-grow min-w-0 ml-4">
                        <div className="flex">
                          <div className="text-white truncate mr-5">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Transition.Child>
      </Transition>
    </>
  );
};

export default GroupChatInfo;
