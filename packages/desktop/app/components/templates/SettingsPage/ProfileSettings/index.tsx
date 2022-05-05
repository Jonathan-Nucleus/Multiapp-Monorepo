import { FC } from "react";
import { CircleWavy, ShieldCheck } from "phosphor-react";
import Link from "next/link";
import Card from "../../../common/Card";
import Avatar from "desktop/app/components/common/Avatar";
import { UserProfileProps } from "../../../../types/common-props";

const ProfileSettings: FC<UserProfileProps> = ({ user }) => {
  return (
    <Card className="p-0">
      <div className="divide-y divide-inherit border-white/[.12]">
        <div>
          <Link href={"/profile/me"}>
            <a>
              <div className="flex items-center px-5 py-4">
                <Avatar size={64} src={user.avatar} />
                <div className="text-left ml-3">
                  <div className="text-xl text-white">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-white opacity-60">
                    See your profile
                  </div>
                </div>
              </div>
            </a>
          </Link>
        </div>
        <div>
          <Link href={"/funds"}>
            <a>
              <div className="flex items-center px-5 py-4">
                <div className="text-success relative">
                  <CircleWavy color="currentColor" weight="fill" size={30} />
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-md font-bold scale-75 text-black">
                    AI
                  </div>
                </div>
                <div className="text-white ml-3">Accredited Investor</div>
              </div>
            </a>
          </Link>
        </div>
        <div>
          <div
            className="flex items-center cursor-pointer px-5 py-4"
            onClick={() => {}}
          >
            <div className="text-success">
              <ShieldCheck size={30} color="currentColor" weight="fill" />
            </div>
            <div className="text-white ml-3">Become a Pro</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSettings;
