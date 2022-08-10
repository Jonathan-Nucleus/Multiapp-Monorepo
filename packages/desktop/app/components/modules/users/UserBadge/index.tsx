import { FC } from "react";
import { Comment } from "shared/graphql/query/post/usePost";
import { UserSummary } from "shared/graphql/fragments/user";
import { PostSummary } from "shared/graphql/fragments/post";
import { ShieldCheck } from "phosphor-react";

interface UserBadgeProps {
  role: UserSummary["role"];
}

const UserBadge: FC<UserBadgeProps> = ({ role }) => {
  return (
    <div className="flex items-center">
      {(role === "VERIFIED" || role === "PROFESSIONAL") && (
        <ShieldCheck
          className="text-success ml-1.5"
          color="currentColor"
          weight="fill"
          size={16}
        />
      )}
      {role == "PROFESSIONAL" && (
        <div className="text-white text-tiny ml-1.5 text-tiny">PRO</div>
      )}
      {(role === "FA" || role === "FO" || role === "IA" || role === "RIA") && (
        <>
          <ShieldCheck
            className="text-primary-solid ml-1.5"
            color="currentColor"
            weight="fill"
            size={16}
          />
          <div className="text-white text-tiny ml-1.5 text-tiny">{role}</div>
        </>
      )}
    </div>
  );
};

export default UserBadge;
