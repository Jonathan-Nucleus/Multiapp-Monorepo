import { FC } from "react";
import Image from "next/image";
import { Chats } from "phosphor-react";

import type { User } from "backend/graphql/users.graphql";
import Button from "../Button";
import Card from "../Card";
import Avatar from "../Avatar";

interface MemberProps {
  member: User;
  hiddenChat?: boolean;
  toggleFollowingUser: (id: string, follow: boolean) => void;
}
const Member: FC<MemberProps> = (props) => {
  const { member, hiddenChat, toggleFollowingUser } = props;

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <div className="w-14 h-14 flex items-center justify-center">
          <Avatar size={56} src={member.avatar} />
        </div>
        <div className="ml-2">
          <div className="flex items-center">
            <div className="text-white">
              {member.firstName} {member.lastName}
            </div>
            <div className="text-white mx-1">{member.position} •</div>
            <Button
              variant="text"
              className="text-xs text-primary tracking-normal font-normal py-0"
              onClick={() => toggleFollowingUser(member._id, true)}
            >
              Follow
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
