import React, { FC, Fragment, useState } from "react";
import NavItem from "./NavItem";
import { Star } from "phosphor-react";
import Container from "../../../layouts/Container";
import { Transition } from "@headlessui/react";
import Watchlist from "../Watchlist";
import Card from "../../../common/Card";

const Navbar: FC = () => {
  const [showWatchlist, setShowWatchlist] = useState(false);

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
            <li className="hidden md:block ml-auto">
              <div
                className="flex items-center text-primary hover:text-white transition-all cursor-pointer py-3"
                onClick={() => setShowWatchlist(true)}
              >
                <Star color="currentColor" weight="fill" size={20} />
                <div className="text-sm font-medium ml-2">Watchlist</div>
              </div>
            </li>
          </ul>
        </nav>
      </Container>
      <Transition appear show={showWatchlist}>
        <Transition.Child
          enter="transition-opacity ease-linear duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-70 z-20" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="fixed inset-0 overflow-auto z-20">
            <Card className="w-96 max-w-full min-h-full rounded-none ml-auto p-0">
              <Watchlist onClose={() => setShowWatchlist(false)} />
            </Card>
          </div>
        </Transition.Child>
      </Transition>
    </div>
  );
};

export default Navbar;
