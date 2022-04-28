import { FC } from "react";
import Image from "next/image";

interface MediaProps {
  src: string;
}

type VideoType = "video/mp4" | "video/ogg" | "video/webm";

function videoType(src: string): VideoType | null {
  if (src.endsWith(".mp4")) return "video/mp4";
  return null;
}

const Media: FC<MediaProps> = ({ src }) => {
  const type = videoType(src);
  return type ? (
    <video controls>
      <source src={`${process.env.NEXT_PUBLIC_POST_URL}/${src}`} type={type} />
    </video>
  ) : (
    <Image
      loader={() => `${process.env.NEXT_PUBLIC_POST_URL}/${src}`}
      src={`${process.env.NEXT_PUBLIC_POST_URL}/${src}`}
      alt=""
      layout="responsive"
      unoptimized={true}
      objectFit="cover"
      width={300}
      height={200}
    />
  );
};

export default Media;
