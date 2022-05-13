import { FC, Fragment, useState } from "react";
import { signOut } from "next-auth/react";
import { Transition } from "@headlessui/react";
import {
  X,
  House,
  Bell,
  Chats,
  UserCircle,
  Lifebuoy,
  Gear,
  ShieldCheck,
  FileText,
  SignOut,
  Headset,
} from "phosphor-react";

import Button from "../../../../common/Button";
import SidebarItem from "./SidebarItem";
import Avatar from "../../../../common/Avatar";
import { UserProfile } from "shared/graphql/query/user/useProfile";
import ModalDialog from "../../../../common/ModalDialog";

interface SidebarProps {
  account: UserProfile | undefined;
  show: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ account, show, onClose }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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
      activeIcon: <Gear color="white" weight="fill" size={24} />,
      inactiveIcon: <Gear color="white" weight="light" size={24} />,
      title: "Account Settings",
      path: "/settings",
      notifications: 0,
    },
    {
      activeIcon: (
        <div className="text-success">
          <ShieldCheck color="currentColor" weight="fill" size={24} />
        </div>
      ),
      inactiveIcon: (
        <div className="text-success">
          <ShieldCheck color="currentColor" weight="fill" size={24} />
        </div>
      ),
      title: "Become a Pro",
      path: "/become-a-pro",
      notifications: 0,
    },
    {
      activeIcon: <Lifebuoy color="white" weight="fill" size={24} />,
      inactiveIcon: <Lifebuoy color="white" weight="light" size={24} />,
      title: "Help / Support",
      path: "/support",
      notifications: 0,
    },
    {
      activeIcon: <FileText color="white" weight="fill" size={24} />,
      inactiveIcon: <FileText color="white" weight="light" size={24} />,
      title: "Policies, Terms & Disclosures",
      path: "https://prometheusalts.com/legals/disclosure-library",
      external: true,
      notifications: 0,
    },
  ];

  if (account?.accreditation === "ACCREDITED") {
    sidebarItems[5] = {
      activeIcon: (
        <div className="text-success">
          <Headset color="white" weight="fill" size={24} />
        </div>
      ),
      inactiveIcon: (
        <div className="text-success">
          <Headset color="white" weight="light" size={24} />
        </div>
      ),
      title: "Contact Fund Specialist",
      path: "/",
      notifications: 0,
    };
  }

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
              <Avatar user={account} size={64} />
              <div className="ml-3">
                <div className="text-xl text-white">
                  {account?.firstName} {account?.lastName}
                </div>
                <div className="text-sm text-white opacity-60">
                  {account && account?.companies.length > 0 && (
                    <>{account?.companies[0].name}</>
                  )}
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
              <div
                className="px-4 py-3 flex items-center justify-between"
                onClick={() => setShowLogoutModal(true)}
              >
                <div className="flex items-center">
                  <span className="flex-shrink-0 flex items-center">
                    <SignOut color="white" weight="light" size={24} />
                  </span>
                  <span className="text-sm normal text-white ml-4">
                    Sign Out
                  </span>
                </div>
              </div>
            </nav>
          </aside>
        </Transition.Child>
      </Transition>
      <ModalDialog
        title={"Are you sure to logout?"}
        className="w-96 max-w-full"
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      >
        <>
          <div className="flex items-center justify-between px-8 py-5">
            <Button
              variant="outline-primary"
              className="w-24"
              onClick={() => setShowLogoutModal(false)}
            >
              No
            </Button>
            <Button
              variant="primary"
              className="w-24"
              onClick={() => signOut()}
            >
              Yes
            </Button>
          </div>
        </>
      </ModalDialog>
    </>
  );
};

export default Sidebar;
