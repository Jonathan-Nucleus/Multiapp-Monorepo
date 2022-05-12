import { FC, HTMLProps } from "react";
import Image from "next/image";
import { UserSummary } from "shared/graphql/fragments/user";
import { CompanySummary } from "shared/graphql/fragments/company";

type User = Pick<UserSummary, "firstName" | "lastName" | "avatar">;
type Company = Pick<CompanySummary, "name" | "avatar">;
interface AvatarProps extends HTMLProps<HTMLDivElement> {
  user?: User | Company;
  size?: number;
  shape?: "circle" | "square";
}

const Avatar: FC<AvatarProps> = ({
  user,
  size = 56,
  shape = "circle",
  ...divProps
}: AvatarProps) => {
  if (!user) {
    // TODO: return skeleton
    return null;
  }

  let initials = "";
  const { avatar } = user;
  if (!avatar) {
    initials =
      "firstName" in user
        ? user.firstName.charAt(0) + user.lastName.charAt(0)
        : user.name.charAt(0);
  }

  return (
    <div
      {...divProps}
      className={`flex items-center justify-center
          flex-shrink-0 relative shadow
          ${shape === "circle" ? "rounded-full" : "rounded-lg"}
          ${divProps.className ?? ""}
          ${!avatar ? "bg-gray-200" : ""}
          overflow-hidden
        `}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {avatar ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${avatar}`}
          alt=""
          width={size}
          height={size}
          className="object-cover"
          unoptimized={true}
        />
      ) : (
        <div className="text uppercase text-primary font-bold">{initials}</div>
      )}
    </div>
  );
};

export default Avatar;
