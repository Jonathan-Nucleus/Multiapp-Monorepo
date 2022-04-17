import { FC } from "react";
import Navbar from "../../../modules/funds/Navbar";
import FeaturedManagers from "./FeaturedManagers";
import ManagersTable from "./ManagersTable";

const FundManagersPage: FC = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto my-6 max-w-screen-xl">
        <header className="hidden lg:flex items-center px-4">
          <h1 className="text-2xl text-white">Browse by Fund Manager</h1>
        </header>
        <div className="hidden lg:block mt-4">
          <FeaturedManagers />
        </div>
        <div className="mt-8">
          <ManagersTable />
        </div>
      </div>
    </>
  );
};

export default FundManagersPage;
