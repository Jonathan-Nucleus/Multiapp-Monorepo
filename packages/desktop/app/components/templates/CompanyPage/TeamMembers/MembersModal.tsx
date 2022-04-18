import React, { FC, useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X, Image as ImageIcon } from "phosphor-react";

import Member from "./Member";
import Card from "../../../common/Card";
import Button from "../../../common/Button";
import SearchInput from "../../../common/SearchInput";

import { FundDetails } from "mobile/src/graphql/query/marketplace";

interface MembersModalProps {
  show: boolean;
  onClose: () => void;
  members: FundDetails["team"];
}

const MembersModal: FC<MembersModalProps> = ({ show, onClose, members }) => {
  const [search, setSearch] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<typeof members>([]);

  useEffect(() => {
    setFilteredMembers(members);
  }, [members]);

  useEffect(() => {
    const _members = [...members];
    if (search) {
      const data = _members.filter(
        (v) =>
          v.firstName.toLowerCase().includes(search.toLowerCase()) ||
          v.lastName.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredMembers(data);
    } else {
      setFilteredMembers(_members);
    }
  }, [search]);

  return (
    <>
      <Dialog open={show} onClose={onClose} className="fixed z-10 inset-0">
        <div className="flex items-center justify-center h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Card className="flex flex-col border-0 h-3/4 mx-auto p-0 z-10 w-full max-w-xl">
            <div className="flex items-center justify-between p-4">
              <div className="text-xl text-white font-medium tracking-wider ml-2">
                View All Team Members
              </div>
              <Button variant="text">
                <X color="white" weight="bold" size={24} onClick={onClose} />
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border-y border-white/[.12]">
              <SearchInput
                placeholder="Search team members..."
                className="rounded-full bg-background-DEFAULT"
                value={search}
                onChange={(event) => {
                  setSearch(event.currentTarget.value);
                }}
              />
            </div>
            <div
              className={`flex flex-col flex-grow  max-w-full md:min-h-0 py-2
              px-6 overflow-y-auto -space-y-4`}
            >
              {filteredMembers.map((member, index) => (
                <Member member={member} hiddenChat={true} key={index} />
              ))}
            </div>
          </Card>
        </div>
      </Dialog>
    </>
  );
};

export default MembersModal;
