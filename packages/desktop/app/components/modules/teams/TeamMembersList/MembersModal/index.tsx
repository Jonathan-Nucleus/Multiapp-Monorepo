import React, { ChangeEvent, FC, useMemo, useState } from "react";
import { Dialog } from "@headlessui/react";
import Card from "../../../../common/Card";
import Button from "../../../../common/Button";
import { X } from "phosphor-react";
import { User } from "backend/graphql/users.graphql";
import Input from "../../../../common/Input";
import UserItem, { UserType } from "desktop/app/components/modules/users/UserItem";

interface MembersModalProps {
  members: UserType[];
  show: boolean;
  onClose: () => void;
}

const MembersModal: FC<MembersModalProps> = ({ members, show, onClose }: MembersModalProps) => {
  const [keyword, setKeyword] = useState("");
  const filteredMembers = useMemo(() => {
    if (keyword.trim().length == 0) {
      return members;
    } else {
      return members.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(keyword.toLowerCase())
      );
    }
  }, [members, keyword]);
  return (
    <>
      <Dialog open={show} onClose={onClose} className="fixed z-10 inset-0">
        <div className="flex items-center justify-center h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Card className="flex flex-col border-0 h-3/4 mx-auto p-0 z-10 w-full max-w-xl rounded">
            <div className="flex items-center justify-between p-4">
              <div className="text-xl text-white font-medium tracking-wider">
                View All Team Members
              </div>
              <Button variant="text" className="opacity-60">
                <X color="white" weight="bold" size={24} onClick={onClose} />
              </Button>
            </div>
            <div className="border-y border-brand-overlay/[.1] px-4 py-3">
              <Input
                placeholder="Search team members..."
                className="bg-black !text-xs !text-white !rounded-full !px-4 !py-3"
                value={keyword}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setKeyword(event.target.value)}
              />
            </div>
            <div className="px-4">
              {filteredMembers.map((member) => (
                <div key={member._id} className="py-4">
                  <UserItem user={member} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Dialog>
    </>
  );
};

export default MembersModal;
