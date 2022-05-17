import { FC } from "react";
import Navbar from "../../../modules/funds/Navbar";
import SearchInput from "../../../common/SearchInput";
import CompaniesTable from "./CompaniesTable";
import Container from "../../../layouts/Container";

const CompaniesPage: FC = () => {
  return (
    <>
      <Navbar />
      <Container className="my-6">
        <header className="hidden lg:flex items-center justify-between">
          <h1 className="text-2xl text-white">Companies</h1>
          <SearchInput placeholder="Search Companies" className="w-72" />
        </header>
        <div className="mt-6">
          <CompaniesTable />
        </div>
      </Container>
    </>
  );
};

export default CompaniesPage;
