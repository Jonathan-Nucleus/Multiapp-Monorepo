import { FC, HTMLProps } from "react";
import getConfig from "next/config";
import Image from "next/image";
import { UserSummary } from "shared/graphql/fragments/user";
import { CompanySummary } from "shared/graphql/fragments/company";

const { publicRuntimeConfig } = getConfig();
const { NEXT_PUBLIC_AWS_BUCKET } = publicRuntimeConfig;

type User = Pick<UserSummary, "_id" | "firstName" | "lastName" | "avatar">;
type Company = Pick<CompanySummary, "_id" | "name" | "avatar">;

interface AvatarProps extends HTMLProps<HTMLDivElement> {
  user?: User | Company;
  size?: number;
  shape?: "circle" | "square";
}

export function backgroundUrl(id: string, mediaUrl: string): string {
  return `${NEXT_PUBLIC_AWS_BUCKET}/backgrounds/${id}/${mediaUrl}`;
}

const Avatar: FC<AvatarProps> = ({
  user,
  size = 56,
  shape = "circle",
  ...divProps
}: AvatarProps) => {
  let initials = "";
  const avatar = user?.avatar
    ? `${NEXT_PUBLIC_AWS_BUCKET}/avatars/${user._id}/${user.avatar}`
    : undefined;
  if (!avatar && user) {
    initials =
      "firstName" in user
        ? user.firstName.charAt(0) + user.lastName.charAt(0)
        : user.name.charAt(0);
  }

  return (
    <div
      {...divProps}
      className={`flex items-center justify-center flex-shrink-0 relative shadow
          ${shape === "circle" ? "rounded-full" : "rounded-lg"}
          ${divProps.className ?? ""}
          ${!avatar ? "bg-gray-200" : "bg-background"}
          overflow-hidden
        `}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {avatar ? (
        <Image
          src={avatar}
          alt=""
          width={size}
          height={size}
          objectFit="cover"
          unoptimized={true}
        />
      ) : (
        <div className="text uppercase text-primary font-bold">{initials}</div>
      )}
    </div>
  );
};

export default Avatar;
