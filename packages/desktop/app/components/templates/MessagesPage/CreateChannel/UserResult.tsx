import { FC } from "react";
import { Avatar } from "stream-chat-react";
import { UserResponse } from "stream-chat";

interface UserResultProps {
  user: UserResponse;
}

const UserResult: FC<UserResultProps> = ({ user }) => (
  <li className="messaging-create-channel__user-result flex items-center p-2">
    <Avatar image={(user.image as string) ?? null} size={40} />
    {user.online && (
      <div className="messaging-create-channel__user-result-online" />
    )}
    <div className="messaging-create-channel__user-result__details">
      <span className="font-bold text-base text-white">{user.name}</span>
      <br />
      <span className="text-sm text-white/[.6]">{user.name}</span>
    </div>
  </li>
);

export default UserResult;
