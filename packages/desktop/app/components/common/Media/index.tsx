import { FC } from "react";
import Image from "next/image";
import { Media as MediaType } from "shared/graphql/fragments/post";

interface MediaProps {
  media: MediaType;
}

type VideoType = "video/mp4" | "video/ogg" | "video/webm";

function videoType(src: string): VideoType | null {
  if (src.endsWith(".mp4")) return "video/mp4";
  return null;
}

const Media: FC<MediaProps> = ({ media }) => {
  const type = videoType(media.url);
  return type ? (
    <video controls>
      <source
        src={`${process.env.NEXT_PUBLIC_POST_URL}/${media.url}`}
        type={type}
      />
    </video>
  ) : (
    <Image
      loader={() => `${process.env.NEXT_PUBLIC_POST_URL}/${media.url}`}
      src={`${process.env.NEXT_PUBLIC_POST_URL}/${media.url}`}
      alt=""
      layout="responsive"
      unoptimized={true}
      objectFit="cover"
      width={300}
      height={300 * media.aspectRatio}
    />
  );
};

export default Media;
