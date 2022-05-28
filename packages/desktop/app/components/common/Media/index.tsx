import { FC } from "react";
import Image from "next/image";
import { Media as MediaType } from "shared/graphql/fragments/post";
import { useAccountContext } from "shared/context/Account";

interface MediaProps {
  media: MediaType;
  mediaId?: string;
}

type VideoType = "video/mp4" | "video/ogg" | "video/webm";

function videoType(src: string): VideoType | null {
  if (src.endsWith(".mp4")) return "video/mp4";
  return null;
}

const Media: FC<MediaProps> = ({ media, mediaId }) => {
  const account = useAccountContext();
  const mediaKey = mediaId ? `${account._id}/${mediaId}` : account._id;

  const type = videoType(media.url);
  return type ? (
    <video controls className="w-full">
      <source
        src={`${process.env.NEXT_PUBLIC_POST_URL}/${mediaKey}/${media.url}`}
        type={type}
      />
    </video>
  ) : (
    <Image
      loader={() =>
        `${process.env.NEXT_PUBLIC_POST_URL}/${mediaKey}/${media.url}`
      }
      src={`${process.env.NEXT_PUBLIC_POST_URL}/${mediaKey}/${media.url}`}
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
