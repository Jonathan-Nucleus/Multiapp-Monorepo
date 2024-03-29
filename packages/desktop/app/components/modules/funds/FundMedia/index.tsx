import getConfig from "next/config";
import { FC } from "react";
import Media from "../../../common/Media";

const { publicRuntimeConfig } = getConfig();
const { NEXT_PUBLIC_AWS_BUCKET } = publicRuntimeConfig;

interface FundMediaProps {
  fundId: string;
  mediaUrl: string;
  hideControls?: boolean;
}

const FundMedia: FC<FundMediaProps> = ({ fundId, mediaUrl, hideControls }) => {
  const key = `${fundId}/${mediaUrl}`;
  const url = `${NEXT_PUBLIC_AWS_BUCKET}/funds/${key}`;
  return <Media url={url} key={fundId} hideControls={hideControls} />;
};

export default FundMedia;
