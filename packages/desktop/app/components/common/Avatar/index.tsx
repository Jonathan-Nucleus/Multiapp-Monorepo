import { FC, HTMLProps } from "react";
import Image from "next/image";
import { useAccount } from "mobile/src/graphql/query/account";

interface AvatarProps extends HTMLProps<HTMLDivElement> {
  src?: string;
  size?: number;
  shape?: "circle" | "square";
}

const DEFAULT_AVATAR =
  "https://t4.ftcdn.net/jpg/02/45/56/35/360_F_245563558_XH9Pe5LJI2kr7VQuzQKAjAbz9PAyejG1.jpg";

const Avatar: FC<AvatarProps> = ({
  children,
  src,
  size = 56,
  shape = "circle",
  ...divProps
}: AvatarProps) => {
  const { data: accountData } = useAccount({ skip: !!src });
  const account = accountData?.account;
  const avatar = src ?? account?.avatar;

  return (
    <div
      {...divProps}
      className={`w-[${size}px] h-[${size}px] flex items-center justify-center
      flex-shrink-0 relative ${divProps.className ?? ""}`}
    >
      <Image
        src={
          avatar
            ? `${process.env.NEXT_PUBLIC_AVATAR_URL}/${avatar}`
            : DEFAULT_AVATAR
        }
        alt=""
        width={size}
        height={size}
        className={`object-cover shadow ${
          shape === "circle" ? "rounded-full" : "rounded-lg"
        }`}
        unoptimized={true}
      />
    </div>
  );
};

export default Avatar;
