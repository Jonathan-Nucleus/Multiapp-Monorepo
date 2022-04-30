import { Popover, Transition } from "@headlessui/react";
import { FC, Fragment } from "react";
import { signOut } from "next-auth/react";
import {
  CaretDown,
  CircleWavy,
  ShieldCheck,
  Gear,
  EnvelopeOpen,
  Lifebuoy,
  FileText,
  SignOut,
  Headset,
} from "phosphor-react";
import MenuItem from "./MenuItem";
import Avatar from "desktop/app/components/common/Avatar";
import { useAccount } from "mobile/src/graphql/query/account";
import Link from "next/link";

const AvatarMenu: FC = () => {
  const { data: accountData } = useAccount();
  const account = accountData?.account;
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
      path: "/setting",
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
  if (account?.accreditation === "ACCREDITED") {
    items[1] = {
      icon: (
        <div className="text-success">
          <Headset color="white" weight="light" size={24} />
        </div>
      ),
      title: "Contact Fund Specialist",
      path: "/",
    };
  }

  return (
    <Popover as="div" className="relative">
      <Popover.Button>
        <div className="flex flex-row items-center cursor-pointer">
          <div className="w-8 h-8 flex items-center justify-center">
            <Avatar size={32} />
          </div>
          <div className="ml-2">
            <CaretDown color="white" weight="bold" size={16} />
          </div>
        </div>
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute right-0 w-64 mt-6 bg-surface-light10 shadow-md shadow-black rounded">
          <div className="divide-y border-white/[.12] divide-inherit pb-2">
            <Popover.Button>
              <Link href={"/profile/me"}>
                <a>
                  <div className="flex flex-row items-center p-4">
                    <Avatar size={64} src={account?.avatar} />
                    <div className="text-left ml-3">
                      <div className="text-xl text-white">
                        {account?.firstName} {account?.lastName}
                      </div>
                      <div className="text-sm text-white opacity-60">
                        See your profile
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            </Popover.Button>
            {items.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                title={item.title}
                path={item.path}
              />
            ))}
            <div>
              <a
                className="cursor-pointer px-4 py-3 flex flex-row items-center"
                onClick={() =>
                  signOut({
                    redirect: false,
                    callbackUrl: process.env.NEXTAUTH_URL,
                  })
                }
              >
              <span className="flex-shrink-0 flex items-center">
                <SignOut color="white" weight="light" size={24} />
              </span>
                <span className="text-sm normal text-white ml-4">Sign Out</span>
              </a>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default AvatarMenu;
