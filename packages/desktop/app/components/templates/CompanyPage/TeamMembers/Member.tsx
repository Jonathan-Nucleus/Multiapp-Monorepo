import { FC } from "react";
import Image from "next/image";
import { Chats } from "phosphor-react";

import type { User } from "backend/graphql/users.graphql";
import Avatar from "desktop/app/components/common/Avatar";
import Button from "../../../../components/common/Button";
import Card from "../../../../components/common/Card";

import { useAccount } from "desktop/app/graphql/queries";
import { useFollowUser } from "mobile/src/graphql/mutation/account";

interface MemberProps {
  member: User;
  hiddenChat?: boolean;
}

const Member: FC<MemberProps> = ({ member, hiddenChat }) => {
  const { data: accountData } = useAccount({ fetchPolicy: "cache-only" });
  const [followUser] = useFollowUser();

  const isFollowing = accountData?.account?.followingIds?.includes(member._id);
  const toggleFollowingUser = async (): Promise<void> => {
    try {
      const { data } = await followUser({
        variables: { follow: !isFollowing, userId: member._id },
        refetchQueries: ["Account"],
      });

      if (!data?.followUser) {
        console.log("err", data);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className="flex items-center justify-between py-6 tracking-wide">
      <div className="w-14 h-14 flex items-center justify-center">
        <Avatar src={member.avatar} size={56} />
      </div>
      <div className="flex flex-col w-full ml-2">
        <div className="flex items-center justify-start">
          <div className="text-white">
            {member.firstName} {member.lastName}
          </div>
          <div className="text-white mx-1">•</div>
          <Button
            variant="text"
            className="text-xs text-primary font-normal py-0 uppercase"
            onClick={toggleFollowingUser}
          >
            {isFollowing ? "unfollow" : "follow"}
          </Button>
        </div>
        <div className="text-xs text-white opacity-50">{member.position}</div>
        <div className="text-xs text-white opacity-50">
          {member.company?.name}
        </div>
      </div>
      {!hiddenChat && <Chats size={32} />}
    </div>
  );
};

export default Member;
