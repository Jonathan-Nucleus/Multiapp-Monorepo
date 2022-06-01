import { FC } from "react";
import Avatar from "desktop/app/components/common/Avatar";
import { Invitee, User } from "shared/graphql/query/account/useInvites";

interface InvitationCoin {
  user?: Invitee;
}

const InvitationCoin: FC<InvitationCoin> = ({ user }) => {
  return (
    <>
      {user ? (
        <div className="w-6 h-6 rounded-full overflow-hidden">
          {(user as User)?.avatar ? (
            <Avatar user={user as User} size={24} />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center
                ${
                  "firstName" in user && "lastName" in user
                    ? "bg-error"
                    : "bg-gray-600"
                }`}
            >
              <span className="uppercase text-xs text-white font-medium">
                {"firstName" in user && "lastName" in user
                  ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                  : `${user.email.charAt(0)}`}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full border border-slate-300" />
      )}
    </>
  );
};

export default InvitationCoin;
