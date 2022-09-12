import { FC, HTMLProps } from "react";
import getConfig from "next/config";
import Image from "next/image";
import { User } from "admin/app/frontend/graphql/fragments/user";

interface BackgroundProps extends HTMLProps<HTMLDivElement> {
  user?: User;
}

const { publicRuntimeConfig } = getConfig();
const { NEXT_PUBLIC_AWS_BUCKET } = publicRuntimeConfig;

const BackgroundImage: FC<BackgroundProps> = ({ user, ...divProps }) => {
  const backgroundImage = user?.background?.url;

  return (
    <div {...divProps}>
      {backgroundImage && (
        <Image
          src={`${NEXT_PUBLIC_AWS_BUCKET}/backgrounds/${user?._id}/${backgroundImage}`}
          alt="Img-Background"
          layout="fill"
          objectFit="cover"
        />
      )}
    </div>
  );
};

export default BackgroundImage;
