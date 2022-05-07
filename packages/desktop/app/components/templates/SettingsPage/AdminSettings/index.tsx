import { FC } from "react";
import { UserCircle, Key, Trash } from "phosphor-react";
import Card from "../../../common/Card";
import Link from "next/link";

const AdminSettings: FC = () => {
  return (
    <Card className="p-0">
      <div className="divide-y divide-inherit border-white/[.12]">
        <div className="px-4 py-5">
          <div className="text-white font-bold">Account Admin</div>
        </div>
        <div>
          <Link href={"/profile/me"}>
            <a>
              <div className="flex items-center p-4">
                <div className="text-white">
                  <UserCircle color="white" weight="fill" size={24} />
                </div>
                <div className="text-white ml-3">Edit your profile</div>
              </div>
            </a>
          </Link>
        </div>
        <div>
          <Link href={"/change-password"}>
            <a>
              <div className="flex items-center p-4">
                <div className="text-white">
                  <Key size={24} color="currentColor" />
                </div>
                <div className="text-white ml-3">Change your password</div>
              </div>
            </a>
          </Link>
        </div>
        <div>
          <Link href={"/change-password"}>
            <a>
              <div className="flex items-center p-4">
                <div className="text-error">
                  <Trash size={24} color="currentColor" />
                </div>
                <div className="text-error ml-3">Delete Account</div>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default AdminSettings;
