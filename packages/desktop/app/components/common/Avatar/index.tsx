import { FC, HTMLProps } from "react";
import Image from "next/image";

interface AvatarProps extends HTMLProps<HTMLDivElement> {
  src?: string;
  size?: number;
  shape?: "circle" | "square";
}

const Avatar: FC<AvatarProps> = ({
  children,
  src,
  size = 56,
  shape = "circle",
  ...divProps
}: AvatarProps) => {
  return (
    <div
      {...divProps}
      className={`flex items-center justify-center
        flex-shrink-0 relative shadow bg-background 
        ${shape === "circle" ? "rounded-full" : "rounded-lg"} 
        ${divProps.className ?? ""}
        overflow-hidden
      `}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {src &&
        <Image
          src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${src}`}
          alt=""
          width={size}
          height={size}
          className="object-cover"
          unoptimized={true}
        />
      }
    </div>
  );
};

export default Avatar;
