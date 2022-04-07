import { FC, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "shared/assets/images/logo-gradient.svg";
import FundLogo from "shared/assets/images/logo-icon.svg";
import {
  House,
  ChartLineUp,
  MagnifyingGlass,
  ChatCircleDots,
  Bell,
  User,
  List,
} from "phosphor-react";
import NavItem from "./NavItem";
import Input from "../../../common/Input";
import Sidebar from "./Sidebar";
import AvatarMenu from "./AvatarMenu";

const navItems = [
  {
    icon: <House color="white" size={24} />,
    title: "Home",
    path: "/",
  },
  {
    icon: <Image src={FundLogo} alt="" />,
    title: "Funds",
    path: "/funds",
  },
  {
    icon: <ChartLineUp color="white" size={24} />,
    title: "Portfolio",
    path: "/portfolio",
  },
];

const Header: FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <header className="bg-surface-light10 shadow-md shadow-black sticky top-0 z-10">
      <nav className="hidden md:flex flex-row items-center p-5">
        <div>
          <div className="w-72 hidden lg:block">
            <Link href="/">
              <a className="flex items-center">
                <Image src={Logo} alt="" layout={"intrinsic"} />
              </a>
            </Link>
          </div>
        </div>
        <div className="flex flex-row items-center">
          {navItems.map((item) => (
            <div key={item.path} className="mx-3">
              <NavItem icon={item.icon} title={item.title} path={item.path} />
            </div>
          ))}
        </div>
        <div className="ml-auto flex flex-row items-center">
          <div className="relative">
            <Input
              className="leading-5 rounded-3xl bg-black text-white px-5"
              placeholder="Search"
            />
            <MagnifyingGlass
              color="grey"
              size={16}
              className="absolute right-5 top-0 h-full"
            />
          </div>
          <Link href="/messages">
            <a className="relative ml-8">
              <ChatCircleDots color="white" size={24} />
              <span className="bg-error rounded-full w-4 h-4 text-xs text-white absolute -top-1.5 -right-1.5 flex items-center justify-center font-medium">
                1
              </span>
            </a>
          </Link>
          <Link href="/notifications">
            <a className="relative ml-4">
              <Bell color="white" size={24} />
              <span className="bg-error rounded-full w-4 h-4 text-xs text-white absolute -top-1.5 -right-1.5 flex items-center justify-center font-medium">
                1
              </span>
            </a>
          </Link>
          <div className="ml-6">
            <AvatarMenu />
          </div>
        </div>
      </nav>
      <nav className="p-5 md:hidden flex items-center justify-between">
        <div
          className="flex flex-row items-center cursor-pointer"
          onClick={() => setShowSidebar(true)}
        >
          <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center relative">
            <User color="black" size={24} />
            <span className="bg-error rounded-full w-4 h-4 text-xs text-white absolute -top-1.5 -left-1.5 flex item-center justify-center font-medium">
              2
            </span>
            <List
              color="white"
              weight="light"
              size={20}
              className="absolute -right-3"
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
          <Link href="/search">
            <a className="flex items-center">
              <MagnifyingGlass color="white" size={32} />
            </a>
          </Link>
        </div>
      </nav>
      {showSidebar && <Sidebar onClose={() => setShowSidebar(false)} />}
    </header>
  );
};

export default Header;
