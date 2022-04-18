import React, { FC } from "react";
import { Dialog } from "@headlessui/react";
import { X, Image as ImageIcon } from "phosphor-react";

import Member from "../Member";
import Card from "../Card";
import Button from "../Button";
import type { User } from "backend/graphql/users.graphql";
import { useAccount } from "desktop/app/graphql/queries";
import { useFollowUser } from "desktop/app/graphql/mutations/profiles";

interface LikeModalProps {
  show: boolean;
  onClose: () => void;
  members: User[];
}

const LikeModal: FC<LikeModalProps> = ({ show, onClose, members }) => {
  const { data: userData, loading: userLoading, refetch } = useAccount();
  const [followUser] = useFollowUser();

  const toggleFollowingUser = async (
    id: string,
    follow: boolean
  ): Promise<void> => {
    try {
      const { data } = await followUser({
        variables: { follow: follow, userId: id },
      });
      if (data?.followUser) {
        refetch();
      } else {
        console.log("err", data);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      <Dialog open={show} onClose={onClose} className="fixed z-10 inset-0">
        <div className="flex items-center justify-center h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Card className="flex flex-col border-0 h-3/4 mx-auto p-0 z-10 w-full max-w-xl">
            <div className="flex items-center justify-between px-4 pt-2">
              <div className="text-xl text-white font-medium">
                People Who Liked This Post
              </div>
              <Button variant="text">
                <X color="white" weight="bold" size={24} onClick={onClose} />
              </Button>
            </div>
            <div className="flex flex-col flex-grow  max-w-full md:min-h-0 p-4 overflow-y-auto">
              {members.map((member, index) => (
                <Member
                  member={member}
                  hiddenChat={true}
                  key={index}
                  toggleFollowingUser={toggleFollowingUser}
                />
              ))}
            </div>
          </Card>
        </div>
      </Dialog>
    </>
  );
};

export default LikeModal;
