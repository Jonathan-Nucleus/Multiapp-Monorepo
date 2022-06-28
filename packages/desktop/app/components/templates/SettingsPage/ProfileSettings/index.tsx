import { FC, useState } from "react";
import { CircleWavy, ShieldCheck, Lock } from "phosphor-react";
import Link from "next/link";

import Card from "../../../common/Card";
import Avatar from "desktop/app/components/common/Avatar";
import Button from "../../../common/Button";
import AccreditationQuestionnaire from "../../Funds/AccreditationQuestionnaire";
import BecomeProModal from "../../../modules/account/BecomeProModal";
import { Account } from "shared/context/Account";

interface ProfileSettingsProps {
  account: Account;
}

const ProfileSettings: FC<ProfileSettingsProps> = ({ account }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showBecomePro, setShowBecomePro] = useState(false);

  return (
    <>
      <Card className="p-0">
        <div className="divide-y divide-inherit border-white/[.12]">
          <div>
            <Link href={"/profile/me"}>
              <a>
                <div className="flex items-center px-5 py-4">
                  <Avatar size={64} user={account} />
                  <div className="text-left ml-3">
                    <div className="text-xl text-white">
                      {account.firstName} {account.lastName}
                    </div>
                    <div className="text-sm text-white opacity-60">
                      See your profile
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </div>
          <div className="flex items-center px-5 py-4">
            {account.accreditation === "NONE" ? (
              <Button
                variant="gradient-primary"
                onClick={() => setIsVerifying(true)}
              >
                <Lock color="currentColor" size={24} weight="light" />
                <span className="ml-2">VERIFY ACCREDITATION</span>
              </Button>
            ) : (
              <>
                <div className="text-success relative">
                  <CircleWavy color="currentColor" weight="fill" size={30} />
                  <div className="absolute inset-0 flex items-center justify-center text-md font-bold text-black">
                    AI
                  </div>
                </div>
                <div className="text-white ml-3">Accredited Investor</div>
              </>
            )}
          </div>
          <div>
            <div
              className="flex items-center cursor-pointer px-5 py-4"
              onClick={() => setShowBecomePro(true)}
            >
              <div className="text-success">
                <ShieldCheck size={30} color="currentColor" weight="fill" />
              </div>
              <div className="text-white ml-3">Become a Pro</div>
            </div>
          </div>
        </div>
      </Card>
      {isVerifying && (
        <AccreditationQuestionnaire
          show={isVerifying}
          onClose={() => setIsVerifying(false)}
        />
      )}
      {showBecomePro && (
        <BecomeProModal
          show={showBecomePro}
          onClose={() => setShowBecomePro(false)}
        />
      )}
    </>
  );
};

export default ProfileSettings;
