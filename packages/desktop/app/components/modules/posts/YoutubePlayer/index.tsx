import { FC } from "react";
import { getVideoIdFromYoutubeLink } from "../../../../../../shared/src/url-utils";

interface LinkPreviewProps {
  videoLink: string;
}

const YoutubePlayer: FC<LinkPreviewProps> = ({
  videoLink,
}: LinkPreviewProps) => {
  const id = getVideoIdFromYoutubeLink(videoLink);

  return (
    <iframe
      className="rounded"
      frameBorder="0"
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${id}?autoplay=0`}
    ></iframe>
  );
};

export default YoutubePlayer;
