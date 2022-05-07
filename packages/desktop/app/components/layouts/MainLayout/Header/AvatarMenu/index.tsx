import { Popover, Transition } from "@headlessui/react";
import { FC, Fragment, useState } from "react";
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
import Link from "next/link";
import ModalDialog from "../../../../common/ModalDialog";
import Button from "../../../../common/Button";
import InviteFriends from "../../../../modules/users/InviteFriends";
import { UserProfile } from "mobile/src/graphql/query/user/useProfile";

interface AvatarMenuProps {
  account: UserProfile | undefined;
}

const AvatarMenu: FC<AvatarMenuProps> = ({ account }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
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
      path: "/funds",
    },
    {
      icon: (
        <div className="text-success">
          <ShieldCheck color="currentColor" weight="fill" size={24} />
        </div>
      ),
      title: "Become a Pro",
      path: "/become-a-pro",
    },
    {
      icon: <Gear color="white" weight="light" size={24} />,
      title: "Account Settings",
      path: "/settings",
    },
    {
      icon: <EnvelopeOpen color="white" weight="light" size={24} />,
      title: "Invite Your Friends",
      path: "/",
      onClick: () => setShowInviteModal(true),
    },
    {
      icon: <Lifebuoy color="white" weight="light" size={24} />,
      title: "Help & Support",
      path: "https://help.prometheusalts.com/hc/en-us",
      external: true,
    },
    {
      icon: <FileText color="white" weight="light" size={24} />,
      title: "Policies, Terms & Disclosures",
      path: "https://prometheusalts.com/legals/disclosure-library",
      external: true,
    },
    {
      icon: <SignOut color="white" weight="light" size={24} />,
      title: "Sign Out",
      path: "/",
      onClick: () => setShowLogoutModal(true),
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
    <>
      <Popover as="div" className="relative">
        <Popover.Button>
          <div className="flex flex-row items-center cursor-pointer">
            <Avatar size={32} src={account?.avatar} />
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
                        <div className="text-xl text-white capitalize">
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
                <div key={index}>
                  {item.onClick ?
                    <MenuItem
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      onClick={item.onClick}
                    />
                    :
                    <Link href={item.path} passHref={item.external}>
                      <a target={item.external ? "_blank" : "_self"}>
                        <MenuItem
                          key={index}
                          icon={item.icon}
                          title={item.title}
                        />
                      </a>
                    </Link>
                  }
                </div>
              ))}
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
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
      <ModalDialog
        show={showInviteModal}
        className="!rounded-2xl"
        onClose={() => setShowInviteModal(false)}
      >
        <InviteFriends onClose={() => setShowInviteModal(false)} />
      </ModalDialog>
    </>
  );
};

export default AvatarMenu;
