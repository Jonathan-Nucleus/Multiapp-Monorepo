import { FC } from "react";
import Avatar from "desktop/app/components/common/Avatar";
import { Invitee } from "mobile/src/graphql/query/account/useInvites";

interface InvitationCoin {
  user?: Invitee;
}

const InvitationCoin: FC<InvitationCoin> = ({
  user,
}) => {
  return (
    <>
      {user ?
        <div className="w-6 h-6 rounded-full overflow-hidden">
          {user.avatar ?
            <Avatar user={user} size={24} />
            :
            <div
              className={`w-full h-full flex items-center justify-center
                ${(user.firstName && user.lastName) ? "bg-error" : "bg-gray-600"}`
              }
            >
              <span className="uppercase text-xs text-white font-medium">
                {(user.firstName && user.lastName) ?
                  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                  :
                  `${user.email.charAt(0)}`
                }
              </span>
            </div>
          }
        </div>
        :
        <div className="w-6 h-6 rounded-full border border-slate-300" />
      }
    </>
  );
};

export default InvitationCoin;
