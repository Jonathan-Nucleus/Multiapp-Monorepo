import { FC, Fragment } from "react";
import {
  X,
  House,
  Bell,
  Chats,
  UserCircle,
  Lifebuoy,
} from "phosphor-react";
import Button from "../../../../common/Button";
import SidebarItem from "./SidebarItem";
import { Transition } from "@headlessui/react";
import Avatar from "../../../../common/Avatar";
import { useAccount } from "mobile/src/graphql/query/account";
import { UserProfile } from "mobile/src/graphql/query/user/useProfile";

const sidebarItems = [
  {
    activeIcon: <House color="white" weight="fill" size={24} />,
    inactiveIcon: <House color="white" weight="light" size={24} />,
    title: "Home",
    path: "/",
    notifications: 0,
  },
  {
    activeIcon: <Bell color="white" weight="fill" size={24} />,
    inactiveIcon: <Bell color="white" weight="light" size={24} />,
    title: "Notifications",
    path: "/notifications",
    notifications: 1,
  },
  {
    activeIcon: <Chats color="white" weight="fill" size={24} />,
    inactiveIcon: <Chats color="white" weight="light" size={24} />,
    title: "Messages",
    path: "/messages",
    notifications: 1,
  },
  {
    activeIcon: <UserCircle color="white" weight="fill" size={24} />,
    inactiveIcon: <UserCircle color="white" weight="light" size={24} />,
    title: "My Profile",
    path: "/profile/me",
    notifications: 0,
  },
  {
    activeIcon: <Lifebuoy color="white" weight="fill" size={24} />,
    inactiveIcon: <Lifebuoy color="white" weight="light" size={24} />,
    title: "Help / Support",
    path: "/support",
    notifications: 0,
  },
];

interface SidebarProps {
  account: UserProfile | undefined;
  show: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ show, onClose }) => {
  const { data: { account } = {} } = useAccount();
  return (
    <>
      <Transition show={show}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/[.67]" onClick={onClose} />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <aside className="fixed w-72 top-0 bottom-0 bg-surface-light10 z-20">
            <div className="text-right px-4 pt-4">
              <Button variant="text" onClick={onClose}>
                <X color="white" weight="bold" size={24} />
              </Button>
            </div>
            <div className="flex flex-row items-center p-4">
              <Avatar size={64} src={account?.avatar} />
              <div className="ml-3">
                <div className="text-xl text-white">
                  {account?.firstName} {account?.lastName}
                </div>
                <div className="text-sm text-white opacity-60">
                  {account && account?.companies.length > 0 &&
                    <>
                      {account?.companies[0].name}
                    </>
                  }
                </div>
              </div>
            </div>
            <nav className="mt-3">
              {sidebarItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  activeIcon={item.activeIcon}
                  inactiveIcon={item.inactiveIcon}
                  title={item.title}
                  path={item.path}
                  notifications={item.notifications}
                />
              ))}
            </nav>
          </aside>
        </Transition.Child>
      </Transition>
    </>
  );
};

export default Sidebar;
