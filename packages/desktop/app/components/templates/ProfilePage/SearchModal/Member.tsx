import { FC } from "react";
import Image from "next/image";
import { Chats } from "phosphor-react";

import type { User } from "backend/graphql/users.graphql";
import Button from "../../../../components/common/Button";
import Card from "../../../../components/common/Card";

interface MemberProps {
  member: User;
  hiddenChat?: boolean;
  selelctedItem?: string;
  toggleFollowingUser: (id: string, follow: boolean) => void;
}
const Member: FC<MemberProps> = (props) => {
  const { member, hiddenChat, selelctedItem, toggleFollowingUser } = props;
  const isFollower = selelctedItem === "follower" ? true : false;
  return (
    <div className="flex items-center justify-between py-4 w-full">
      <div className="flex items-center w-full">
        <div className="w-14 h-14 flex items-center justify-center">
          <Image
            loader={() =>
              `${process.env.NEXT_PUBLIC_AVATAR_URL}/${member.avatar}`
            }
            src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${member.avatar}`}
            alt=""
            width={56}
            height={56}
            className="object-cover rounded-full"
            unoptimized={true}
          />
        </div>
        <div className="ml-2 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-white">
              {member.firstName} {member.lastName} {member.position} •
            </div>
            <Button
              variant="text"
              className="text-xs text-primary tracking-normal font-normal py-0"
              onClick={() => toggleFollowingUser(member._id, isFollower)}
            >
              {isFollower ? "FOLLOW" : "UNFOLLOW"}
            </Button>
          </div>
          <div className="text-xs text-white opacity-60">{member.position}</div>
          <div className="text-xs text-white opacity-60">
            {member.company?.name}
          </div>
        </div>
      </div>
      {!hiddenChat && <Chats size={32} />}
    </div>
  );
};

export default Member;
