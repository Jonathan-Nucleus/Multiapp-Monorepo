import { FC } from "react";
import NavItem from "./NavItem";
import { Star } from "phosphor-react";
import Container from "../../../layouts/Container";

const Navbar: FC = () => {
  return (
    <div className="bg-background-cardDark shadow-sm shadow-black">
      <Container>
        <nav>
          <ul className="grid grid-cols-2 md:flex">
            <li className="md:w-44">
              <NavItem path={"/funds"} title="Funds" />
            </li>
            <li className="md:w-44">
              <NavItem path={"/funds/managers"} title="Fund Managers" />
            </li>
            <li className="md:w-44 hidden">
              <NavItem path={"/funds/companies"} title="Companies" />
            </li>
            <li className="hidden w-44 ml-auto">
              <NavItem
                path={"/funds/watchlist"}
                icon={<Star color="currentColor" weight="fill" size={20} />}
                title="Watchlist"
              />
            </li>
          </ul>
        </nav>
      </Container>
    </div>
  );
};

export default Navbar;
