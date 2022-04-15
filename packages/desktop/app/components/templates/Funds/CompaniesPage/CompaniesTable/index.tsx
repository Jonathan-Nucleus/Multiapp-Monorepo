import { FC, useState } from "react";
import Button from "../../../../common/Button";
import { SortAscending } from "phosphor-react";
import Paginator from "../../../../common/Paginator";
import CompanyItem from "./CompanyItem";

const companies = [
  {
    name: "Vibrant Ventures",
    avatar: "",
    postIds: [],
    followerIds: [],
    manager: {
      firstName: "Jarret",
      lastName: "Christie",
      avatar: "",
    },
  },
  {
    name: "Vibrant Ventures",
    avatar: "",
    postIds: [],
    followerIds: [],
    manager: {
      firstName: "Jarret",
      lastName: "Christie",
      avatar: "",
    },
  },
  {
    name: "Vibrant Ventures",
    avatar: "",
    postIds: [],
    followerIds: [],
    manager: {
      firstName: "Jarret",
      lastName: "Christie",
      avatar: "",
    },
  },
  {
    name: "Vibrant Ventures",
    avatar: "",
    postIds: [],
    followerIds: [],
    manager: {
      firstName: "Jarret",
      lastName: "Christie",
      avatar: "",
    },
  },
  {
    name: "Vibrant Ventures",
    avatar: "",
    postIds: [],
    followerIds: [],
    manager: {
      firstName: "Jarret",
      lastName: "Christie",
      avatar: "",
    },
  },
  {
    name: "Vibrant Ventures",
    avatar: "",
    postIds: [],
    followerIds: [],
    manager: {
      firstName: "Jarret",
      lastName: "Christie",
      avatar: "",
    },
  },
];

export type Company = typeof companies[0];

const ManagersTable: FC = () => {
  const [page, setPage] = useState(1);
  return (
    <>
      <div className="mt-4">
        <div className="border-white/[.12] lg:divide-y divide-inherit">
          <header className="hidden lg:grid grid-cols-4 py-2">
            <div className="flex items-center">
              <div className="text-xs text-white font-bold">COMPANY NAME</div>
              <Button variant="text" className="text-white ml-2 py-0">
                <SortAscending color="currentColor" weight="bold" size={16} />
              </Button>
            </div>
            <div className="flex items-center px-1">
              <div className="text-xs text-white font-medium">FUNDS</div>
              <Button variant="text" className="hidden text-white ml-2 py-0">
                <SortAscending color="currentColor" weight="bold" size={16} />
              </Button>
            </div>
            <div className="flex items-center px-1">
              <div className="text-xs text-white font-medium">
                FUND MANAGERS
              </div>
              <Button variant="text" className="hidden text-white ml-2 py-0">
                <SortAscending color="currentColor" weight="bold" size={16} />
              </Button>
            </div>
          </header>
          {companies.map((company, index) => (
            <div key={index} className="mb-4 lg:mb-0">
              <CompanyItem company={company} />
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
