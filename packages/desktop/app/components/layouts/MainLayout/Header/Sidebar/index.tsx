import { FC } from "react";
import {
  User,
  X,
  House,
  Bell,
  Chats,
  UserCircle,
  Lifebuoy,
} from "phosphor-react";
import Button from "../../../../common/Button";
import SidebarItem from "../SidebarItem";

const sidebarItems = [
  {
    activeIcon: <House color="white" weight="fill" size={24} />,
    inactiveIcon: <House color="white" weight="light" size={24} />,
    title: "Home",
    path: "/",
  },
  {
    activeIcon: <Bell color="white" weight="fill" size={24} />,
    inactiveIcon: <Bell color="white" weight="light" size={24} />,
    title: "Notifications",
    path: "/notifications",
  },
  {
    activeIcon: <Chats color="white" weight="fill" size={24} />,
    inactiveIcon: <Chats color="white" weight="light" size={24} />,
    title: "Messages",
    path: "/messages",
  },
  {
    activeIcon: <UserCircle color="white" weight="fill" size={24} />,
    inactiveIcon: <UserCircle color="white" weight="light" size={24} />,
    title: "My Profile",
    path: "/profile",
  },
  {
    activeIcon: <Lifebuoy color="white" weight="fill" size={24} />,
    inactiveIcon: <Lifebuoy color="white" weight="light" size={24} />,
    title: "Help / Support",
    path: "/support",
  },
];

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ onClose }) => {
  return (
    <aside className="bg-black/[.6] fixed w-screen h-screen top-0 left-0 z-10">
      <div className="bg-surface-light10 w-72 h-full shadow-md">
        <div className="text-right px-4 pt-4">
          <Button variant="text" onClick={onClose}>
            <X color="white" weight="bold" size={24} />
          </Button>
        </div>
        <div className="flex flex-row items-center p-4">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
            <User color="black" size={48} />
          </div>
          <div className="ml-3">
            <div className="text-xl text-white">Richard Branson</div>
            <div className="text-sm text-white opacity-60">Virgin Group</div>
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
            />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
