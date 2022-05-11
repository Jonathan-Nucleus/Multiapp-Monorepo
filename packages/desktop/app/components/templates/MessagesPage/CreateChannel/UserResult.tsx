import { FC } from "react";
import { Avatar } from "stream-chat-react";
import { UserResponse } from "stream-chat";

interface UserResultProps {
  user: UserResponse;
}

const UserResult: FC<UserResultProps> = ({ user }) => (
  <li className="flex items-center p-2">
    <Avatar image={(user.image as string) ?? null} size={48} />
    <div className="ml-1">
      <div className="font-bold text-base text-white">{user.name}</div>
      <div className="text-sm text-white/[.6]">{user.name}</div>
    </div>
  </li>
);

export default UserResult;
