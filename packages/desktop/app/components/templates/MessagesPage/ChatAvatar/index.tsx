import { FC, useMemo } from "react";
import { Channel, User } from "shared/context/Chat/types";
import Avatar from "../../../common/Avatar";
import { useAccountContext } from "shared/context/Account";
import { useRouter } from "next/router";

interface ChatAvatarProps {
  user?: User;
  members?: Channel["state"]["members"];
  clickable?: boolean;
  size: number;
  showStatus?: boolean;
}

const ChatAvatar: FC<ChatAvatarProps> = ({
  user,
  members,
  size,
  clickable = true,
  showStatus = true,
}) => {
  const account = useAccountContext();
  const router = useRouter();
  const users = useMemo(() => {
    return (
      members
        ? Object.values(members)
            .filter((member) => member.user_id != account._id)
            .map((member) => member.user!)
        : user
        ? [user]
        : []
    ).map((user) => ({ ...user, _id: user.id }));
  }, [account._id, members, user]);
  const isOnline = users.some((user) => user.online);
  return (
    <div
      className={clickable ? "cursor-pointer" : ""}
      onClick={async () => {
        if (clickable) {
          if (user) {
            await router.push(`/profile/${user.id}`);
          } else if (users.length == 1) {
            await router.push(`/profile/${users[0].id}`);
          }
        }
      }}
    >
      <div className="relative">
        {users.length == 1 && <Avatar size={size} user={users[0]} />}
        {users.length >= 2 && (
          <div
            className="rounded-full bg-black overflow-hidden"
            style={{ width: `${size}px`, height: `${size}px` }}
          >
            <div className={`grid grid-cols-2`}>
              {users.slice(0, 4).map((user, index) => (
                <Avatar
                  key={index}
                  size={size / 2}
                  user={user}
                  className="rounded-none"
                />
              ))}
            </div>
          </div>
        )}
        {showStatus && (
          <>
            {isOnline ? (
              <div className="w-4 h-4 bg-success border border-[#1B2C44] rounded-full absolute -right-1 -bottom-0.5" />
            ) : (
              <div className="w-4 h-4 bg-error border border-[#1B2C44] rounded-full absolute -right-1 -bottom-0.5" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatAvatar;
