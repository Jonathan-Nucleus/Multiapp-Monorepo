import { FC } from "react";
import Navbar from "../../../modules/funds/Navbar";
import Input from "../../../common/Input";
import CompaniesTable from "./CompaniesTable";

const CompaniesPage: FC = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto my-6 lg:px-4">
        <header className="hidden lg:flex items-center justify-between">
          <h1 className="text-2xl text-white">Companies</h1>
          <Input
            className="w-60 bg-black border !border-white/[.12] !rounded-full text-xs !text-white px-3"
            placeholder="Search Companies"
          />
        </header>
        <div className="mt-6">
          <CompaniesTable />
        </div>
      </div>
    </>
  );
};

export default CompaniesPage;
