import { FC } from "react";
import NavItem from "./NavItem";
import { Star } from "phosphor-react";

const Navbar: FC = () => {
  return (
    <div className="bg-background-cardDark shadow-sm shadow-black">
      <nav className="container mx-auto  max-w-screen-xl lg:px-4">
        <ul className="grid grid-cols-3 md:flex">
          <li className="md:w-44">
            <NavItem path={"/funds"} title="FUNDS" />
          </li>
          <li className="md:w-44">
            <NavItem path={"/funds/managers"} title="FUND MANAGERS" />
          </li>
          <li className="md:w-44">
            <NavItem path={"/funds/companies"} title="COMPANIES" />
          </li>
          <li className="hidden w-44 ml-auto">
            <NavItem
              path={"/funds/watchlist"}
              icon={<Star color="currentColor" weight="fill" size={20} />}
              title="WATCHLIST"
            />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
