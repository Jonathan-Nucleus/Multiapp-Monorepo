import React, { FC, useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X, Image as ImageIcon } from "phosphor-react";

import Member from "./Member";
import Card from "../../../common/Card";
import Button from "../../../common/Button";
import Input from "../../../common/Input";
import type { User } from "backend/graphql/users.graphql";
import { useAccount } from "desktop/app/graphql/queries";
import { useFollowCompany } from "desktop/app/graphql/mutations/profiles";
import { Company, FollowUser } from "mobile/src/graphql/query/company";

interface SearchModalProps {
  show: boolean;
  onClose: () => void;
  company: Company;
}

const SearchModal: FC<SearchModalProps> = ({ show, onClose, company }) => {
  const { data: userData, loading: userLoading } = useAccount({
    fetchPolicy: "cache-only",
  });
  const [followCompany] = useFollowCompany();
  const [selectedItem, setSelectedItem] = useState("follower");
  const [members, setMembers] = useState<FollowUser[]>([]);
  const [allMembers, setAllMembers] = useState<FollowUser[]>([]);
  const [search, setSearch] = useState("");

  const account = userData?.account;
  const followers = company.followers ?? [];
  const following = company.following ?? [];

  useEffect(() => {
    if (selectedItem === "follower") {
      setAllMembers(followers);
    } else {
      setAllMembers(following);
    }
  }, [selectedItem, followers, following]);

  useEffect(() => {
    const _allMembers = [...allMembers];
    if (search) {
      const data = _allMembers.filter(
        (v) =>
          v.firstName.toLowerCase().includes(search.toLowerCase()) ||
          v.lastName.toLowerCase().includes(search.toLowerCase())
      );
      setMembers(data);
    } else {
      setMembers(_allMembers);
    }
  }, [search, allMembers, followers, following]);

  const toggleFollowingUser = async (
    id: string,
    follow: boolean
  ): Promise<void> => {
    if (!account) return;

    try {
      const { data } = await followCompany({
        variables: { follow: follow, companyId: account._id },
        refetchQueries: ["Account"],
      });

      if (!data?.followCompany) {
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
              <div className="flex items-center">
                <Button
                  variant="text"
                  onClick={() => setSelectedItem("follower")}
                  className={
                    selectedItem === "follower" ? `border-b border-primary` : ""
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
                    selectedItem === "follow"
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
                value={search}
                onChange={(event) => {
                  setSearch(event.currentTarget.value);
                }}
              />
            </div>
            <div className="flex flex-col flex-grow  max-w-full md:min-h-0 p-4 overflow-y-auto">
              {members.map((member, index) => (
                <Member
                  member={member}
                  hiddenChat={true}
                  key={index}
                  toggleFollowingUser={toggleFollowingUser}
                  selectedItem={selectedItem}
                />
              ))}
            </div>
          </Card>
        </div>
      </Dialog>
    </>
  );
};

export default SearchModal;
