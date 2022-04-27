import { FC } from "react";
import Avatar from "desktop/app/components/common/Avatar";

interface InvitationCoin {
  avatar?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  variant: string;
}

const InvitationCoin: FC<InvitationCoin> = ({
  avatar,
  email,
  firstName,
  lastName,
  variant,
}) => {
  return avatar ? (
    <Avatar src={avatar} size={16} />
  ) : (
    <div
      className={`w-6 h-6 mx-0.5 rounded-full flex
        justify-center items-center ${
          email
            ? `bg-${variant ? variant : "transparent"}`
            : "border border-slate-300"
        }`}
    >
      {email && (
        <span className="uppercase text-xs">
          {!!firstName && !!lastName
            ? `${firstName.charAt(0)}${lastName.charAt(0)}`
            : email.charAt(0)}
        </span>
      )}
    </div>
  );
};

export default InvitationCoin;
