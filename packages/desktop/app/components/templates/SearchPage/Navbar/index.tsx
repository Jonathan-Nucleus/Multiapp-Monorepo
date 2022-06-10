import { FC } from "react";
import NavItem from "./NavItem";

interface NavbarProps {
  query: string;
}

const Navbar: FC<NavbarProps> = ({ query }) => {
  return (
    <div className="bg-background-cardDark shadow-sm shadow-black">
      <nav className="max-w-3xl mx-auto">
        <ul className="grid grid-cols-4 md:flex">
          <li className="md:w-44">
            <NavItem path={`/search/all?query=${query}`} title="All" />
          </li>
          <li className="md:w-44">
            <NavItem path={`/search/people?query=${query}`} title="People" />
          </li>
          <li className="md:w-44">
            <NavItem path={`/search/companies?query=${query}`} title="Companies" />
          </li>
          <li className="md:w-44">
            <NavItem path={`/search/posts?query=${query}`} title="Posts" />
          </li>
          <li className="md:w-44">
            <NavItem path={`/search/funds?query=${query}`} title="Funds" />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
