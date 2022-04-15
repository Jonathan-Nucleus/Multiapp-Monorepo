import { FC, useState } from "react";
import Input from "../../../../common/Input";
import Button from "../../../../common/Button";
import { SortAscending } from "phosphor-react";
import Paginator from "../../../../common/Paginator";
import ManagerItem from "./ManagerItem";

const managers = [
  {
    firstName: "Dustin",
    lastName: "Durgan",
    position: "Founder, CEO",
    avatar: "58ec51e9-57a0-4d86-97d2-3d42e8f823ba.png",
    postIds: [],
    followerIds: [],
    type: "PRO",
    company: {
      avatar: "",
      name: "Vibrant Ventures",
    },
  },
  {
    firstName: "Carrie",
    lastName: "Gibson",
    position: "Founder, CEO",
    avatar: "ab3efdcb-5549-4962-bf5c-511a4d11ac18.png",
    postIds: [],
    followerIds: [],
    type: "PRO",
    company: {
      avatar: "",
      name: "Gutkowski, Wisoky and Blanda",
    },
  },
  {
    firstName: "Dustin",
    lastName: "Durgan",
    position: "Founder, CEO",
    avatar: "58ec51e9-57a0-4d86-97d2-3d42e8f823ba.png",
    postIds: [],
    followerIds: [],
    type: "PRO",
    company: {
      avatar: "",
      name: "Vibrant Ventures",
    },
  },
  {
    firstName: "Carrie",
    lastName: "Gibson",
    position: "Founder, CEO",
    avatar: "ab3efdcb-5549-4962-bf5c-511a4d11ac18.png",
    postIds: [],
    followerIds: [],
    type: "PRO",
    company: {
      avatar: "",
      name: "Gutkowski, Wisoky and Blanda",
    },
  },
  {
    firstName: "Dustin",
    lastName: "Durgan",
    position: "Founder, CEO",
    avatar: "58ec51e9-57a0-4d86-97d2-3d42e8f823ba.png",
    postIds: [],
    followerIds: [],
    type: "PRO",
    company: {
      avatar: "",
      name: "Vibrant Ventures",
    },
  },
  {
    firstName: "Carrie",
    lastName: "Gibson",
    position: "Founder, CEO",
    avatar: "ab3efdcb-5549-4962-bf5c-511a4d11ac18.png",
    postIds: [],
    followerIds: [],
    type: "PRO",
    company: {
      avatar: "",
      name: "Gutkowski, Wisoky and Blanda",
    },
  },
];

export type Manager = typeof managers[0];

const ManagersTable: FC = () => {
  const [page, setPage] = useState(1);
  return (
    <>
      <div className="hidden lg:flex items-center justify-between">
        <h2 className="text-white">All Managers</h2>
        <Input
          className="w-60 bg-black border !border-white/[.12] !rounded-full text-xs !text-white px-3"
          placeholder="Search Managers"
        />
      </div>
      <div className="mt-4">
        <div className="border-white/[.12] lg:divide-y divide-inherit">
          <header className="hidden lg:grid grid-cols-4 py-2">
            <div className="flex items-center">
              <div className="text-xs text-white font-bold">MANAGER NAME</div>
              <Button variant="text" className="text-white ml-2 py-0">
                <SortAscending color="currentColor" weight="bold" size={16} />
              </Button>
            </div>
            <div className="flex items-center px-1">
              <div className="text-xs text-white font-medium">COMPANY</div>
              <Button variant="text" className="hidden text-white ml-2 py-0">
                <SortAscending color="currentColor" weight="bold" size={16} />
              </Button>
            </div>
            <div className="flex items-center px-1">
              <div className="text-xs text-white font-medium">FUND MANAGED</div>
              <Button variant="text" className="hidden text-white ml-2 py-0">
                <SortAscending color="currentColor" weight="bold" size={16} />
              </Button>
            </div>
          </header>
          {managers.map((manager, index) => (
            <div key={index} className="mb-4 lg:mb-0">
              <ManagerItem manager={manager} />
            </div>
          ))}
          <footer className="py-5">
            <Paginator current={page} total={10} onSelect={setPage} />
          </footer>
        </div>
      </div>
    </>
  );
};

export default ManagersTable;
