import getConfig from "next/config";
import { Media as MediaType } from "shared/graphql/fragments/post";
import { FC } from "react";
import Media from "../../../common/Media";

const { publicRuntimeConfig } = getConfig();
const { NEXT_PUBLIC_AWS_BUCKET } = publicRuntimeConfig;

interface FundMediaProps {
  fundId: string;
  mediaUrl: string;
}

const FundMedia: FC<FundMediaProps> = ({ fundId, mediaUrl }) => {
  const key = `${fundId}/${mediaUrl}`;
  const url = `${NEXT_PUBLIC_AWS_BUCKET}/funds/${key}`;
  return <Media url={url} key={fundId} />;
};

export default FundMedia;
