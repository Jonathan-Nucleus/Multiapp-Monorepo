import { FC, useEffect, useState } from "react";
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
import SidebarItem from "./SidebarItem";

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
    path: "/profile",
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
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ onClose }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-10">
      <aside
        className={
          (mounted ? "bg-black/[.6]" : "bg-transparent") +
          " w-screen h-screen transition-all duration-500"
        }
      >
        <div
          className={
            (mounted ? "translate-x-0" : "-translate-x-full") +
            " w-72 bg-surface-light10 h-full shadow-md transition-all duration-500"
          }
        >
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
                notifications={item.notifications}
              />
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
