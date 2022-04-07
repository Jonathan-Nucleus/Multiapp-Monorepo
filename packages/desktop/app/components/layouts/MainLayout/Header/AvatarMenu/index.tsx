import { Menu } from "@headlessui/react";
import { FC } from "react";
import {
  CaretDown,
  User,
  CircleWavy,
  ShieldCheck,
  Gear,
  EnvelopeOpen,
  Lifebuoy,
  FileText,
} from "phosphor-react";
import MenuItem from "./MenuItem";

const AvatarMenu: FC = () => {
  const items = [
    {
      icon: (
        <div className="relative text-success">
          <CircleWavy color="currentColor" weight="fill" size={24} />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold scale-75 text-background">
            AI
          </div>
        </div>
      ),
      title: "Accredited Investor",
      path: "/",
    },
    {
      icon: (
        <div className="text-success">
          <ShieldCheck color="currentColor" weight="fill" size={24} />
        </div>
      ),
      title: "Become a Pro",
      path: "/",
    },
    {
      icon: <Gear color="white" weight="light" size={24} />,
      title: "Account Settings",
      path: "/",
    },
    {
      icon: <EnvelopeOpen color="white" weight="light" size={24} />,
      title: "Invite Your Friends",
      path: "/",
    },
    {
      icon: <Lifebuoy color="white" weight="light" size={24} />,
      title: "Help & Support",
      path: "/",
    },
    {
      icon: <FileText color="white" weight="light" size={24} />,
      title: "Policies, Terms & Disclosures",
      path: "/",
    },
  ];
  return (
    <Menu as="div" className="relative">
      <Menu.Button>
        <div className="flex flex-row items-center cursor-pointer">
          <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
            <User color="black" size={24} />
          </div>
          <div className="ml-2">
            <CaretDown color="white" weight="bold" size={16} />
          </div>
        </div>
      </Menu.Button>
      <Menu.Items className="absolute right-0 w-64 mt-6 bg-surface-light10 shadow-md shadow-black rounded">
        <div className="divide-y border-white/[.12] divide-inherit pb-2">
          <div className="flex flex-row items-center p-4">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
              <User color="black" size={48} />
            </div>
            <div className="ml-3">
              <div className="text-xl text-white">Richard Branson</div>
              <div className="text-sm text-white opacity-60">Virgin Group</div>
            </div>
          </div>
          {items.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              title={item.title}
              path={item.path}
            />
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default AvatarMenu;
