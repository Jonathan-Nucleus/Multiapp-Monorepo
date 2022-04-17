import { FC } from "react";
import Navbar from "../../../modules/funds/Navbar";
import SearchInput from "../../../common/SearchInput";
import CompaniesTable from "./CompaniesTable";

const CompaniesPage: FC = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto my-6 lg:px-4 max-w-screen-xl">
        <header className="hidden lg:flex items-center justify-between">
          <h1 className="text-2xl text-white">Companies</h1>
          <SearchInput placeholder="Search Companies" className="w-72" />
        </header>
        <div className="mt-6">
          <CompaniesTable />
        </div>
      </div>
    </>
  );
};

export default CompaniesPage;
