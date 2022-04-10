import { FC } from "react";
import Image from "next/image";

import { Chats } from "phosphor-react";

import Button from "../../../../components/common/Button";
import Card from "../../../../components/common/Card";

type UserProps = {
  image: string;
  name: string;
  type: string;
  position: string;
  description: string;
};

interface MemberProps {
  member: UserProps;
}
const Member: FC<MemberProps> = (props) => {
  const { member } = props;
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <div className="w-14 h-14 flex items-center justify-center">
          <Image
            loader={() => member.image}
            src={member.image}
            alt=""
            width={56}
            height={56}
            className="object-cover rounded-full"
            unoptimized={true}
          />
        </div>
        <div className="ml-2">
          <div className="flex items-center">
            <div className="text-white">{member.name}</div>
            <div className="text-white mx-1">{member.type} •</div>
            <Button
              variant="text"
              className="text-xs text-primary tracking-normal font-normal py-0"
            >
              FOLLOW
            </Button>
          </div>
          <div className="text-xs text-white opacity-60">{member.position}</div>
          <div className="text-xs text-white opacity-60">
            {member.description}
          </div>
        </div>
      </div>
      <Chats size={32} />
    </div>
  );
};

export default Member;
