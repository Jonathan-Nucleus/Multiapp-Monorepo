import { Popover, Transition } from "@headlessui/react";
import { FC, Fragment, useState } from "react";
import {
  CaretDown,
  CircleWavy,
  ShieldCheck,
  Lifebuoy,
  FileText,
  SignOut,
  Headset,
} from "phosphor-react";
import MenuItem from "./MenuItem";
import Avatar from "desktop/app/components/common/Avatar";
import Link from "next/link";
import ModalDialog from "../../../../common/ModalDialog";
import InviteFriends from "../../../../modules/users/InviteFriends";
import BecomeProModal from "../../../../modules/account/BecomeProModal";
import { getInitials } from "../../../../../lib/utilities";
import { AccreditationOptions } from "backend/schemas/user";
import SignOutModal from "./SignOutModal";
import { Account } from "shared/context/Account";

interface AvatarMenuProps {
  account: Account;
}

const AvatarMenu: FC<AvatarMenuProps> = ({ account }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showBecomeProModal, setShowBecomeProModal] = useState(false);
  const items = [
    {
      icon: (
        <div className="relative text-success">
          <CircleWavy color="currentColor" weight="fill" size={24} />
          <div className="absolute inset-0 flex items-center justify-center text-tiny font-bold text-background">
            {getInitials(AccreditationOptions[account.accreditation].label)}
          </div>
        </div>
      ),
      title: AccreditationOptions[account.accreditation].label,
      path: "/funds",
      external: false,
    },
    {
      icon: (
        <div className="text-success">
          <ShieldCheck color="currentColor" weight="fill" size={24} />
        </div>
      ),
      title: "Become a Pro",
      path: "/",
      onClick: () => setShowBecomeProModal(true),
      external: false,
    },
    /**
     * Omit until post-launch.
     {
      icon: <Gear color="white" weight="light" size={24} />,
      title: "Account Settings",
      path: "/settings",
    },*/
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
      external: false,
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
      external: false,
    };
  }

  return (
    <>
      <Popover as="div" className="relative">
        <Popover.Button className="flex items-center">
          <div className="w-8 h-8">
            <Avatar user={account} size={32} />
          </div>
          <div className="ml-2">
            <CaretDown color="white" weight="bold" size={16} />
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
                      <Avatar user={account} size={64} />
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
                  {item.onClick ? (
                    <MenuItem
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      onClick={item.onClick}
                    />
                  ) : (
                    <Link href={item.path} passHref={item.external}>
                      <a
                        target={item.external ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                      >
                        <MenuItem
                          key={index}
                          icon={item.icon}
                          title={item.title}
                        />
                      </a>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
      <SignOutModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
      <ModalDialog
        show={showInviteModal}
        className="!rounded-2xl"
        onClose={() => setShowInviteModal(false)}
      >
        <InviteFriends onClose={() => setShowInviteModal(false)} />
      </ModalDialog>
      {showBecomeProModal && (
        <BecomeProModal
          show={showBecomeProModal}
          onClose={() => setShowBecomeProModal(false)}
        />
      )}
    </>
  );
};

export default AvatarMenu;
