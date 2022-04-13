import { FC } from "react";
import Image from "next/image";
import Button from "../../../../common/Button";
import { Manager } from "..";
import Card from "../../../../common/Card";
import { ShieldCheck } from "phosphor-react";

interface ManagerItemProps {
  manager: Manager;
}

const ManagerItem: FC<ManagerItemProps> = ({ manager }: ManagerItemProps) => {
  return (
    <>
      <div className="hidden lg:grid grid-cols-4 py-4">
        <div className="flex items-center">
          <div className="w-14 h-14 relative bg-white flex flex-shrink-0 rounded-full overflow-hidden">
            {manager.avatar && (
              <Image
                loader={() =>
                  `${process.env.NEXT_PUBLIC_AVATAR_URL}/${manager.avatar}`
                }
                src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${manager.avatar}`}
                alt=""
                layout="fill"
                className="object-cover"
                unoptimized={true}
              />
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm text-white">
              {manager.firstName} {manager.lastName}
            </div>
            <div className="text-sm text-white opacity-60">
              {manager.position}
            </div>
          </div>
        </div>
        <div className="flex items-center px-1">
          <div className="w-14 h-14 relative bg-white flex flex-shrink-0 rounded-full overflow-hidden">
            {manager.company.avatar && (
              <Image
                loader={() =>
                  `${process.env.NEXT_PUBLIC_AVATAR_URL}/${manager.company.avatar}`
                }
                src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${manager.company.avatar}`}
                alt=""
                layout="fill"
                className="object-cover"
                unoptimized={true}
              />
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm text-white">{manager.company.name}</div>
          </div>
        </div>
        <div className="flex items-center px-1">
          <div className="text-sm text-white">{manager.company.name} Fund</div>
        </div>
        <div className="flex items-center justify-end">
          <Button
            variant="text"
            className="text-primary font-normal tracking-normal py-0"
          >
            FOLLOW
          </Button>
          <Button
            variant="outline-primary"
            className="text-primary text-white tracking-normal ml-4"
          >
            VIEW PROFILE
          </Button>
        </div>
      </div>
      <Card className="block lg:hidden border-0 rounded-none bg-primary-solid/[.07] px-5 py-3">
        <div className="flex items-center">
          <div className="w-14 h-14 relative bg-white flex flex-shrink-0 rounded-full overflow-hidden">
            {manager.avatar && (
              <Image
                loader={() =>
                  `${process.env.NEXT_PUBLIC_AVATAR_URL}/${manager.avatar}`
                }
                src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${manager.avatar}`}
                alt=""
                layout="fill"
                className="object-cover"
                unoptimized={true}
              />
            )}
          </div>
          <div className="w-14 ml-4">
            <div className="text-sm text-white font-medium">
              {manager.postIds.length}
            </div>
            <div className="text-xs text-white">Posts</div>
          </div>
          <div className="w-14 ml-4">
            <div className="text-sm text-white font-medium">
              {manager.followerIds.length}
            </div>
            <div className="text-xs text-white">Followers</div>
          </div>
          <div className="ml-auto">
            <Button
              variant="outline-primary"
              className="text-primary text-white tracking-normal"
            >
              FOLLOW
            </Button>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="text-white font-medium">
            {manager.firstName} {manager.lastName}
          </div>
          <div className="text-success ml-3">
            <ShieldCheck color="currentColor" weight="fill" size={16} />
          </div>
          <div className="text-xs text-white ml-1">{manager.type}</div>
        </div>
        <div className="text-xs text-white mt-1">{manager.position}</div>
        <div className="text-xs text-primary">{manager.company.name}</div>
        <div className="border-t border-white/[.12] mt-4">
          <div className="text-sm text-white font-medium mt-4">
            FUNDS MANAGED
          </div>
          <div className="text-sm text-primary mt-2">
            {manager.company.name} Fund
          </div>
        </div>
      </Card>
    </>
  );
};

export default ManagerItem;
