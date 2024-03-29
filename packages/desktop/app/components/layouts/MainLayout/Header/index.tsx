import { FC, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  House,
  MagnifyingGlass,
  ChatCircleDots,
  Bell,
  List,
} from "phosphor-react";

import Logo from "shared/assets/images/logo-gradient.svg";
import FundLogo from "shared/assets/images/logo-icon.svg";

import NavItem from "./NavItem";
import Sidebar from "./Sidebar";
import AvatarMenu from "./AvatarMenu";
import Avatar from "../../../common/Avatar";
import { useNotifications } from "shared/graphql/query/notification/useNotifications";
import SearchView from "./SearchView";
import Container from "../../Container";
import { useAccountContext } from "shared/context/Account";
import { useUnreadCount } from "shared/context/Chat";

export const navItems = [
  {
    id: "site-header-home",
    icon: <House color="white" size={24} />,
    title: "Home",
    path: "/",
  },
  {
    id: "site-header-invest",
    icon: <Image src={FundLogo} alt="" />,
    title: "Invest",
    path: "/funds",
    active: ["/funds", "/funds/managers", "/funds/companies"],
  },
  /* Remove this for now as it is not in scope for MVP.
  {
    id: "site-header-chart",
    icon: <ChartLineUp color="white" size={24} />,
    title: "Portfolio",
    path: "/portfolio",
  },*/
];

const Header: FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const account = useAccountContext();
  const unread = useUnreadCount();

  const { data: { notifications = [] } = {} } = useNotifications();

  return (
    <header className="bg-surface-light10 shadow sticky top-0 z-20">
      <Container>
        <nav className="hidden md:flex flex-row items-center py-5">
          <div>
            <div className="lg:w-48 xl:w-80 hidden lg:block mr-5">
              <Link href="/">
                <a className="flex items-center">
                  <Image src={Logo} alt="" layout={"intrinsic"} />
                </a>
              </Link>
            </div>
          </div>
          <div className="flex flex-row items-center">
            {navItems.map((item, index) => (
              <div key={index} className="mx-3">
                <NavItem item={item} activePath={item.active} />
              </div>
            ))}
          </div>
          <div className="ml-auto flex flex-row items-center">
            <SearchView />
            <Link href="/messages">
              <a className="relative ml-8">
                <ChatCircleDots color="white" size={24} />
                {unread > 0 ? (
                  <span
                    className={`bg-error-light rounded-full w-4 h-4 text-tiny
                  text-white absolute -top-1.5 -right-1.5 flex items-center
                  justify-center font-medium`}
                  >
                    {unread}
                  </span>
                ) : null}
              </a>
            </Link>
            <Link href="/notifications">
              <a className="relative ml-4">
                <Bell color="white" size={24} />
                {notifications.filter((v) => v.isNew).length > 0 && (
                  <span
                    className={`bg-error-light rounded-full w-4 h-4 text-tiny
                    text-white absolute -top-1.5 -right-1.5 flex items-center
                    justify-center font-medium`}
                  >
                    {notifications.filter((v) => v.isNew).length}
                  </span>
                )}
              </a>
            </Link>
            <div className="ml-6">
              <AvatarMenu account={account} />
            </div>
          </div>
        </nav>
      </Container>
      <nav className="p-5 md:hidden flex items-center justify-between">
        <div
          className="flex flex-row items-center cursor-pointer"
          onClick={() => setShowSidebar(true)}
        >
          <div className="w-9 h-9 flex items-center justify-center relative">
            <Avatar user={account} size={36} className="z-10" />
            {notifications.filter((v) => v.isNew).length > 0 && (
              <span className="bg-error-light rounded-full w-4 h-4 text-xs text-white absolute -top-1.5 -left-1.5 flex item-center justify-center font-medium z-50">
                {notifications.filter((v) => v.isNew).length}
              </span>
            )}

            <List
              color="white"
              weight="light"
              size={20}
              className="absolute -right-3 opacity-80"
            />
          </div>
        </div>
        <div>
          <Link href="/funds">
            <a className="flex items-center">
              <Image src={FundLogo} alt="" width={32} height={32} />
            </a>
          </Link>
        </div>
        <div>
          <Link href="/">
            <a className="flex items-center">
              <MagnifyingGlass color="white" size={32} />
            </a>
          </Link>
        </div>
      </nav>
      <Sidebar
        account={account}
        show={showSidebar}
        onClose={() => setShowSidebar(false)}
      />
    </header>
  );
};

export default Header;
