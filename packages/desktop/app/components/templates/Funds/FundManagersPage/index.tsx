import { FC } from "react";
import Navbar from "../../../modules/funds/Navbar";
import FeaturedManagers from "./FeaturedManagers";
import ManagersTable from "./ManagersTable";
import Container from "../../../layouts/Container";

const FundManagersPage: FC = () => {
  return (
    <>
      <Navbar />
      <Container className="my-6">
        <header className="hidden lg:flex items-center px-4 lg:px-0">
          <h1 className="text-2xl text-white">Browse by Fund Manager</h1>
        </header>
        <div className="hidden lg:block mt-4">
          <FeaturedManagers />
        </div>
        <div className="mt-8">
          <ManagersTable />
        </div>
      </Container>
    </>
  );
};

export default FundManagersPage;
